const express = require('express');
const OpenAI = require("openai");
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
ffmpeg.setFfmpegPath(ffmpegInstaller.path);


const openai = new OpenAI({
  apiKey: "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",
});

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

// Make sure output folder exists
const outputFolder = path.join(__dirname, 'output');
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

// Route to generate video idea using OpenAI SDK
app.post('/generate-idea', async (req, res) => {
  const { topic } = req.body;
  console.log("topic ", topic);
  if (!topic || topic.trim() === '') {
    return res.status(400).send('❌ Topic is required.');
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // same as your working model
      messages: [
         { role: 'system', content: 'You are an AI video content idea generator.' },
        { role: 'user', content: `Generate 5 catchy video content ideas for YouTube on: ${topic}` }
      ],
      max_tokens: 200,
    });

    const ideas = completion.choices[0].message.content.trim();
    res.json({ idea: ideas });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating video idea.');
  }
});

// Route to generate video preview
app.post('/generate-video', async (req, res) => {
  const { idea } = req.body;

  try {
    // ✅ Step 1: Get 5 points from OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: 'system', content: 'You are an AI that extracts list items from content ideas.' },
        { role: 'user', content: `List 5 key points or items for this video idea: ${idea}` }
      ],
      max_tokens: 200,
    });

    const listText = completion.choices[0].message.content.trim();
    const lines = listText.split('\n').filter(line => line.trim() !== '');

    console.log('✅ Extracted list:', lines);

    if (lines.length === 0) {
      return res.status(500).send('Failed to extract points.');
    }

    // ✅ Step 2: Create multi-slide video using FFmpeg
    const outputFile = path.join(__dirname, 'output', 'video_preview.mp4');

    // Build filter_complex for FFmpeg to chain slides
    const filterComplex = lines.map((line, index) => {
      return `[${index}:v]drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:text='${line.replace(/'/g, "\\'")}':fontsize=40:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2:box=1:boxcolor=black@0.5:boxborderw=10[v${index}]`;
    }).join('; ');

    const inputs = lines.map(() => 'color=c=blue:s=1280x720:d=2').join('|');
    const inputArgs = lines.map(() => '-f lavfi -i color=c=blue:s=1280x720:d=2').join(' ');

    // Build FFmpeg command dynamically
    const ffmpegCommand = `ffmpeg ${inputArgs} -filter_complex "${filterComplex}; ${lines.map((_, i) => `[v${i}]`).join('')}concat=n=${lines.length}:v=1:a=0[outv]" -map "[outv]" -y ${outputFile}`;

    // ✅ Run FFmpeg using child_process
    const { exec } = require('child_process');
    exec(ffmpegCommand, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ FFmpeg error:', error);
        return res.status(500).send('Error generating video.');
      }
      console.log('✅ Video preview generated.');
      res.json({ previewUrl: `http://localhost:5000/videos/video_preview.mp4` });
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating video.');
  }
});




// Serve generated video previews
app.use('/videos', express.static(path.join(__dirname, 'output')));

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
