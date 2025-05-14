import React from 'react';
import './VideoIdeaDisplay.css';

const VideoIdeaDisplay = ({ videoIdea, onGeneratePreview, onSaveToLibrary, loading }) => {
  if (!videoIdea) return null;

  return (
    <div className="generation-content">
      <div className="generation-idea">
        <h3>Video Idea</h3>
        <div className="idea-content">
          {/* Assuming videoIdea is a string, potentially with newlines */}
          {typeof videoIdea === 'string' ? 
            videoIdea.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))
            : <p>Invalid idea format</p> // Fallback for unexpected format
          }
        </div>
        <div className="idea-actions">
          <button
            className="generation-button" // Standard button style
            onClick={onGeneratePreview}
            disabled={loading}
          >
            Generate Video Preview
          </button>
          <button
            className="save-button" // Specific style for save button
            onClick={onSaveToLibrary}
            disabled={loading}
          >
            Save to Library
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoIdeaDisplay; 