const express = require('express');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const { google } = require('googleapis');


//  console.log(require('@ffmpeg-installer/ffmpeg').path);
require('dotenv').config();

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const app = express();
const PORT = 5000;
const GEMINI_API_KEY = "AIzaSyDBD300wv8Qy-7LAwfP6FbWOfo8nnTiFWA";
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

app.use(express.json());
app.use(cors());

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);
// Step 1: Auth URL
app.get('/auth-url', (req, res) => {
  const scopes = ['https://www.googleapis.com/auth/youtube.upload'];
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
  console.log("auth-url",url);
  res.send({ url });
});

// Step 2: OAuth callback
app.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  console.log("get oauthcallback ke ander haii");
  console.log(tokens);
  res.redirect(`http://localhost:3000/youtube-callback?accessToken=${tokens.access_token}`);
});

// Step 3: Upload API
app.post('/upload', async (req, res) => {

  try {
    console.log('upload routes ke ander haii');
    const { accessToken, title, description, tags } = req.body;
    oauth2Client.setCredentials({ access_token: accessToken });

    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

    const response = await youtube.videos.insert({
      part: 'snippet,status',
      requestBody: {
        snippet: {
          title: title + ' #Shorts',
          description,
          tags,
        },
        status: {
          privacyStatus: 'public',
        },
      },
      media: {
        body: fs.createReadStream('output/video_preview.mp4'), // path to your generated video
      },
    });

    res.json({ success: true, data: response.data });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


//mongodb connection
mongoose.connect('mongodb://127.0.0.1:27017/otp-auth', {}
  // , { useNewUrlParser: true, useUnifiedTopology: true }
)
  .then(() => console.log('Mongo Connected'))
  .catch((err) => console.error(err));


app.use('/api/auth', authRoutes);  //auth routes

// Make sure output folder exists
const outputFolder = path.join(__dirname, 'output');
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}


// Route to generate video idea using Gemini API
app.post('/generate-idea', async (req, res) => {
  const { topic } = req.body;
  console.log('topic ', topic);
  if (!topic || topic.trim() === '') {
    return res.status(400).send('❌ Topic is required.');
  }

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `You are an AI video content idea generator. Generate 5 catchy video content ideas for YouTube on: ${topic}`,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 200,
          temperature: 0.7,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const ideas = response.data.candidates[0].content.parts[0].text.trim();
    res.json({ idea: ideas });
  } catch (err) {
    console.error('Gemini API Error:', {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
      config: err.config?.url,
    });
    if (err.response && err.response.status === 429) {
      return res.status(429).send('Gemini API quota exceeded. Please check your plan or try again later.');
    }
    if (err.response && err.response.status === 400) {
      return res.status(400).send('Invalid request to Gemini API. Check request format or model availability.');
    }
    if (err.response && err.response.status === 403) {
      return res.status(403).send('Invalid or unauthorized Gemini API key. Verify your API key.');
    }
    res.status(500).send('Error generating video idea.');
  }
});

// Route to generate video preview
app.post('/generate-video', async (req, res) => {
  const { idea } = req.body;

  try {
    // Step 1: Get 5 points from Gemini API
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `You are an AI that extracts list items from content ideas. List 5 key points or items for this video idea: ${idea}`,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 200,
          temperature: 0.7,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const listText = response.data.candidates[0].content.parts[0].text.trim();
    const lines = listText.split('\n').filter(line => line.trim() !== '');

    console.log('✅ Extracted list:', lines);

    if (lines.length === 0) {
      return res.status(500).send('Failed to extract points.');
    }

    // Step 2: Create multi-slide video using FFmpeg
    const outputFile = path.join(__dirname, 'output', 'video_preview.mp4');

    // Create a command instance
    const command = ffmpeg();

    // Add inputs
    for (let i = 0; i < lines.length; i++) {
      command.input('color=c=blue:s=1280x720:d=2')
        .inputFormat('lavfi')
        .inputOptions('-f lavfi');
    }

    // Prepare filter complex
    const filters = [];
    const streams = [];

    lines.forEach((line, index) => {
      // Escape special characters in the text
      const escapedText = line
        .replace(/'/g, "'\\\\\\''")  // Escape single quotes
        .replace(/:/g, '\\:')       // Escape colons
        .replace(/\[/g, '\\[')      // Escape square brackets
        .replace(/\]/g, '\\]');

      filters.push(
        `[${index}:v]` +
        `drawtext=` +
        `text='${escapedText}':` +
        `fontsize=40:` +
        `fontcolor=white:` +
        `x=(w-text_w)/2:` +
        `y=(h-text_h)/2:` +
        `box=1:` +
        `boxcolor=black@0.5:` +
        `boxborderw=10` +
        `[v${index}]`
      );
      streams.push(`[v${index}]`);
    });

    filters.push(`${streams.join('')}concat=n=${lines.length}:v=1:a=0[outv]`);

    // Apply filters
    command.complexFilter(filters)
      .outputOptions('-map [outv]');

    // Set output
    command.save(outputFile);

    command.on('end', () => {
      console.log('✅ Video preview generated.');
      res.json({ previewUrl: `http://localhost:5000/videos/video_preview.mp4` });
    });

    command.on('error', (err) => {
      console.error('❌ FFmpeg error:', err);
      res.status(500).send('Error generating video.');
    });

  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
    if (err.response && err.response.status === 429) {
      return res.status(429).send('Gemini API quota exceeded. Please check your plan or try again later.');
    }
    res.status(500).send('Error generating video.');
  }
});
// Serve generated video previews
app.use('/videos', express.static(path.join(__dirname, 'output')));

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});