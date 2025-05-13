import React, { useState } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';

function App() {
  const [videoIdea, setVideoIdea] = useState('');
  const [videoPreview, setVideoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const generateVideoIdea = async (topic) => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.post('http://localhost:5000/generate-idea', { topic });
      setVideoIdea(res.data.idea);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Failed to generate idea.');
    }
  };

  const generateVideoPreview = async (idea) => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.post('http://localhost:5000/generate-video', { idea });
      setVideoPreview(res.data.previewUrl); // Example: URL of generated video
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Failed to generate video.');
    }
  };

  return (
    <div className="App">
      <h1>Video Content Generator</h1>

      <input
        type="text"
        placeholder="Enter video topic"
        onBlur={(e) => generateVideoIdea(e.target.value)}
      />

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {videoIdea && (
        <div>
          <h3>Generated Video Idea:</h3>
          <p>{videoIdea}</p>
          <button onClick={() => generateVideoPreview(videoIdea)}>Generate Video</button>
        </div>
      )}

      {videoPreview && (
        <div>
          <h3>Video Preview:</h3>
          <ReactPlayer url={videoPreview} controls={true} />
        </div>
      )}
    </div>
  );
}

export default App;
