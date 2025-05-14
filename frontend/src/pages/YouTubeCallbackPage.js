import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom'; // Assuming you use react-router-dom
import './YouTubeCallbackPage.css'; // We'll create this CSS file next

function YouTubeCallbackPage() {
    const [message, setMessage] = useState('Processing YouTube authorization...');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const processCallback = async () => {
            const params = new URLSearchParams(location.search);
            const accessToken = params.get('accessToken');

            const title = localStorage.getItem('youtubeShare_title');
            const description = localStorage.getItem('youtubeShare_description');
            const tagsString = localStorage.getItem('youtubeShare_tags');
            const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()) : [];

            if (!accessToken) {
                setError('Authorization failed: No access token received.');
                setLoading(false);
                return;
            }

            if (!title) {
                setError('Error: Video title not found. Please try sharing again.');
                setLoading(false);
                return;
            }

            try {
                setMessage('Uploading video details to YouTube...');
                const response = await axios.post('http://localhost:5000/upload', {
                    accessToken,
                    title,
                    description,
                    tags,
                });

                if (response.data.success) {
                    setMessage(`Video shared successfully on YouTube! Video ID: ${response.data.data.id}`);
                    setError('');
                } else {
                    setError(response.data.error || 'Failed to upload video to YouTube.');
                }
            } catch (err) {
                console.error('Error uploading to YouTube:', err);
                setError(err.response?.data?.error || 'An error occurred while uploading to YouTube.');
            } finally {
                // Clean up localStorage
                localStorage.removeItem('youtubeShare_title');
                localStorage.removeItem('youtubeShare_description');
                localStorage.removeItem('youtubeShare_tags');
                setLoading(false);
            }
        };

        processCallback();
    }, [location]);

    return (
        <div className="youtube-callback-container">
            <h2>YouTube Sharing Status</h2>
            {loading && <p className="status-loading">{message}</p>}
            {!loading && error && <p className="status-error">Error: {error}</p>}
            {!loading && !error && <p className="status-success">{message}</p>}
            {!loading && (
                <div className="actions-home">
                    <Link to="/" className="home-link">Go to Homepage</Link>
                </div>
            )}
        </div>
    );
}

export default YouTubeCallbackPage; 