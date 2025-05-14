import React, { useState } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
import './Generation.css';
import YouTubeShareForm from './YouTubeShareForm';
import TabNavigation from './common/TabNavigation';
import IdeaGeneratorForm from './generation/IdeaGeneratorForm';

function Generation() {
  // States for original functionality
  const [videoIdea, setVideoIdea] = useState('');
  const [videoPreview, setVideoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // States for video ideas management
  const initialIdeas = [
    {
      id: 1,
      title: "Trainspotting: Epic Fails & Wins! (Compilation)",
      concept: "A fast-paced, comedic compilation of train-related mishaps and amazing feats. This could include near misses, funny passenger moments caught on camera, impressive train journeys through stunning landscapes, and maybe even some historical train crashes (with responsible context and respectful tone). Think \"Fails of the Week\" but specifically trains."
    },
    {
      id: 2,
      title: "Around the World by Train: The Ultimate Bucket List Journey!",
      concept: "A visually stunning travelogue following a journey across multiple countries by train. Highlight the unique cultures, landscapes, and train experiences in each location. Focus on the adventure and highlight the romance of train travel. Could be a single long video or a series."
    },
    {
      id: 3,
      title: "How Trains Work: From Steam to Bullet Train! (Simplified)",
      concept: "A visually engaging explainer video breaking down the mechanics of different train types, from historic steam engines to modern high-speed trains. Show the evolution of train technology and explain how each system works in simple, accessible terms."
    }
  ];

  const [videoIdeas, setVideoIdeas] = useState(initialIdeas);
  const [newTitle, setNewTitle] = useState("");
  const [newConcept, setNewConcept] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [activeTab, setActiveTab] = useState('generate');
  const [showYouTubeShareForm, setShowYouTubeShareForm] = useState(false);

  const tabs = [
    { id: 'generate', name: 'Generate' },
    { id: 'manage', name: 'Manage Ideas' },
  ];

  // Modified to accept topic as a parameter
  const handleGenerateIdea = async (currentTopic) => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.post('http://localhost:5000/generate-idea', { topic: currentTopic });
      const formattedIdea = formatGeneratedIdea(res.data.idea);
      setVideoIdea(formattedIdea);
    } catch (err) {
      setError('Failed to generate idea. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to format the generated idea into our structure
  const formatGeneratedIdea = (rawIdea) => {
    // This is a placeholder - the actual formatting would depend on the API response format
    // Assuming the API returns a simple string with the idea
    return rawIdea;
  };

  const generateVideoPreview = async () => {
    if (!videoIdea) return;

    try {
      setLoading(true);
      setError('');
      const res = await axios.post('http://localhost:5000/generate-video', { idea: videoIdea });
      setVideoPreview(res.data.previewUrl);
    } catch (err) {
      setError('Failed to generate video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Video ideas management functions
  const addVideoIdea = () => {
    if (newTitle.trim() === "" || newConcept.trim() === "") return;

    const newIdea = {
      id: videoIdeas.length > 0 ? Math.max(...videoIdeas.map(idea => idea.id)) + 1 : 1,
      title: newTitle,
      concept: newConcept
    };

    setVideoIdeas([...videoIdeas, newIdea]);
    setNewTitle("");
    setNewConcept("");

    // Update the current videoIdea to display this new idea
    setVideoIdea(`Title: ${newIdea.title}\nConcept:${newIdea.concept}`);
  };

  const saveIdeaToLibrary = () => {
    if (!videoIdea) return;

    // Parse the generated idea to extract title and concept
    // This is a simplified example assuming the AI generates in our format
    let title = "New Generated Idea";
    let concept = videoIdea;

    // Try to extract title and concept from the formatted string
    const titleMatch = videoIdea.match(/\*\*Title:\*\*\s*(.*?)(?=\n\*\*Concept:|$)/i);
    const conceptMatch = videoIdea.match(/\*\*Concept:\*\*\s*(.*?)$/is);

    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].trim();
    }

    if (conceptMatch && conceptMatch[1]) {
      concept = conceptMatch[1].trim();
    }

    const newIdea = {
      id: videoIdeas.length > 0 ? Math.max(...videoIdeas.map(idea => idea.id)) + 1 : 1,
      title: title,
      concept: concept
    };

    setVideoIdeas([...videoIdeas, newIdea]);
    setActiveTab('manage');
  };

  const startEdit = (idea) => {
    setEditMode(true);
    setEditId(idea.id);
    setNewTitle(idea.title);
    setNewConcept(idea.concept);
  };

  const saveEdit = () => {
    if (newTitle.trim() === "" || newConcept.trim() === "") return;

    setVideoIdeas(videoIdeas.map(idea =>
      idea.id === editId
        ? { ...idea, title: newTitle, concept: newConcept }
        : idea
    ));

    setEditMode(false);
    setEditId(null);
    setNewTitle("");
    setNewConcept("");
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditId(null);
    setNewTitle("");
    setNewConcept("");
  };

  const deleteIdea = (id) => {
    setVideoIdeas(videoIdeas.filter(idea => idea.id !== id));
  };

  const selectIdeaForGeneration = (idea) => {
    setVideoIdea(`Title: ${idea.title}\nConcept: ${idea.concept}`);
    setActiveTab('generate');
  };

  return (
    <div className="generation-container">
      <div className="generation-header">
        <h1>Video Content Generator</h1>
        <p>Transform your ideas into engaging video content</p>

        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {activeTab === 'generate' ? (
        <div className="generate-tab">
          <IdeaGeneratorForm onGenerate={handleGenerateIdea} loading={loading} />

          {error && <div className="generation-error">{error}</div>}
          {loading && <div className="generation-loading">Processing your request...</div>}

          {videoIdea && (
            <div className="generation-content">
              <div className="generation-idea">
                <h3>Video Idea</h3>
                <div className="idea-content">
                  {videoIdea.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
                <div className="idea-actions">
                  <button
                    className="generation-button"
                    onClick={generateVideoPreview}
                    disabled={loading}
                  >
                    Generate Video Preview
                  </button>
                  <button
                    className="save-button"
                    onClick={saveIdeaToLibrary}
                    disabled={loading}
                  >
                    Save to Library
                  </button>
                </div>
              </div>

              {videoPreview && (
                <div className="generation-preview">
                  <h3>Video Preview</h3>
                  <div className="video-player">
                    <ReactPlayer
                      url={videoPreview}
                      controls={true}
                      width="100%"
                      height="auto"
                    />
                  </div>
                  <button  className="action-button add" onClick={() => setShowYouTubeShareForm(true)}>share on youtube</button>
                  {showYouTubeShareForm && videoPreview && (
                    <YouTubeShareForm
                      onCancel={() => setShowYouTubeShareForm(false)}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="manage-tab">
          <h2>Video Ideas Library</h2>

          {/* Video ideas list */}
          <div className="ideas-list">
            {videoIdeas.length === 0 ? (
              <p className="no-ideas">No video ideas yet. Generate or add one!</p>
            ) : (
              videoIdeas.map((idea) => (
                <div key={idea.id} className="idea-card">
                  <div className="idea-content">
                    <h3>{idea.id}. <span className="idea-title">Title:</span> {idea.title}</h3>
                    <p><span className="idea-concept">Concept:</span> {idea.concept}</p>
                  </div>
                  <div className="idea-actions">
                    <button
                      className="action-button edit"
                      onClick={() => startEdit(idea)}
                    >
                      Edit
                    </button>
                    <button
                      className="action-button delete"
                      onClick={() => deleteIdea(idea.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="action-button select"
                      onClick={() => selectIdeaForGeneration(idea)}
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Form to add or edit video ideas */}
          <div className="idea-form">
            <h3>{editMode ? "Edit Video Idea" : "Add New Video Idea"}</h3>
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter video title"
              />
            </div>
            <div className="form-group">
              <label>Concept:</label>
              <textarea
                value={newConcept}
                onChange={(e) => setNewConcept(e.target.value)}
                placeholder="Describe your video concept"
                rows={4}
              />
            </div>
            <div className="form-actions">
              {editMode ? (
                <>
                  <button className="action-button save" onClick={saveEdit}>
                    Save Changes
                  </button>
                  <button className="action-button cancel" onClick={cancelEdit}>
                    Cancel
                  </button>
                </>
              ) : (
                <button className="action-button add" onClick={addVideoIdea}>
                  Add Video Idea
                </button>
              )}
            </div>
          </div>

          {/* Export section */}
          <div className="export-section">
            <h3>Export Ideas</h3>
            <div className="export-content">
              <pre>
                {videoIdeas.map((idea) => (
                  `${idea.id}. Title: ${idea.title}\n   Concept: ${idea.concept}\n\n`
                )).join('')}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Generation;