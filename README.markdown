# 🎬 Video Content Generator

A full-stack web application that generates video content ideas using the Google Gemini API and creates preview videos using FFmpeg. Users can share videos to YouTube and manage their content ideas seamlessly.

## 🚀 Features

- 💡 Generate creative video content ideas and scripts using Gemini API.
- 🎥 Automatically convert scripts into slide-based videos using FFmpeg.
- 📤 Upload videos to YouTube via OAuth2 authentication.
- ✉️ OTP-based login with NodeMailer for secure access.
- 📂 Manage and preview generated ideas and videos.

## 🧰 Tech Stack

### Frontend
- ReactJS
- Axios
- ReactPlayer
- CSS Modules / Tailwind (optional)

### Backend
- Node.js + Express
- Google Gemini API
- FFmpeg (via fluent-ffmpeg)
- Google YouTube Data API v3
- NodeMailer
- MongoDB (for OTP authentication and content history)

## 📸 Project Flows

### 1. 💡 Idea Generation Flow
- User enters a topic → Gemini API generates idea + script → Displayed to user.

### 2. 🎥 Video Generation Flow
- User submits title & script → FFmpeg generates slide-based video → Returns video URL → Preview via ReactPlayer.

### 3. 📤 Share to YouTube Flow
- User authenticates with Google OAuth2 → Backend uploads video via YouTube API → Returns YouTube link.

## ⚙️ Getting Started

### 🔧 Prerequisites
- Node.js and npm
- MongoDB (local or cloud)
- FFmpeg installed
- Google Cloud project with Gemini API and YouTube Data API enabled

### 🖥️ Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/video-content-generator.git
   cd video-content-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd client && npm install
   ```

3. **Set up `.env` files**

   In `/`:
   ```ini
   PORT=5000
   MONGO_URI=your_mongodb_uri
   GEMINI_API_KEY=your_gemini_api_key
   EMAIL_USER=your_email
   EMAIL_PASS=your_password
   ```

   For YouTube OAuth:
   ```ini
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   REDIRECT_URI=http://localhost:5000/api/video/oauth2callback
   ```

4. **Start the project**
   ```bash
   npm run dev
   ```

## ⚠️ Challenges Faced
- Parsing and formatting Gemini AI responses.
- FFmpeg configuration for dynamic video generation.
- Managing OAuth2 for YouTube uploads.
- Email deliverability for OTP-based login.
- Smooth integration between backend and frontend.

## 🌱 Future Improvements
- 🔊 Add AI voiceovers using Text-to-Speech (TTS).
- 🎨 Customizable video themes.
- 🗃️ User dashboard with history and saved content.
- 🌐 Multilingual support.
- 📱 Mobile app version (React Native).
- ✍️ Script editor with live preview.