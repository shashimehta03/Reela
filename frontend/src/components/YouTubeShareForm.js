import React, { useState } from 'react';
import axios from 'axios';
import './YouTubeShareForm.css'; // We'll create this CSS file next

function YouTubeShareForm({ onCancel }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState(''); // Comma-separated tags
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleShare = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('Title is required.');
            return;
        }
        setLoading(true);
        setError('');

        try {
            // Store details in localStorage to retrieve after OAuth redirect
            localStorage.setItem('youtubeShare_title', title);
            localStorage.setItem('youtubeShare_description', description);
            localStorage.setItem('youtubeShare_tags', tags);

            // Get the auth URL from the backend
            const response = await axios.get('http://localhost:5000/auth-url');
            if (response.data.url) {
                // Redirect to Google for authentication
                window.location.href = response.data.url;
            } else {
                setError('Could not get authentication URL. Please try again.');
                setLoading(false);
            }
        } catch (err) {
            console.error('Error initiating YouTube share:', err);
            setError(err.response?.data?.message || 'Failed to initiate share. Please check console for details.');
            setLoading(false);
        }
    };

    return (
        <div className="youtube-share-form-container">
            <h4>Share Video on YouTube</h4>
            {error && <p className="share-error">{error}</p>}
            <form onSubmit={handleShare}>
                <div className="form-group">
                    <label htmlFor="youtube-title">Title</label>
                    <input
                        id="youtube-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Video Title for YouTube"
                        required
                        disabled={loading}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="youtube-description">Description</label>
                    <textarea
                        id="youtube-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Video Description (add #Shorts for YouTube Shorts)"
                        rows={3}
                        disabled={loading}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="youtube-tags">Tags (comma-separated)</label>
                    <input
                        id="youtube-tags"
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="e.g., travel, food, tech"
                        disabled={loading}
                    />
                </div>
                <div className="form-actions">
                    <button type="submit" className="share-button" disabled={loading}>
                        {loading ? 'Proceeding...' : 'Authorize & Share on YouTube'}
                    </button>
                    <button type="button" className="cancel-button" onClick={onCancel} disabled={loading}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default YouTubeShareForm; 