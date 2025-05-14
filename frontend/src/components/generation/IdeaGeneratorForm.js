import React, { useState } from 'react';
import './IdeaGeneratorForm.css';

const IdeaGeneratorForm = ({ onGenerate, loading }) => {
    const [topic, setTopic] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!topic.trim()) return;
        onGenerate(topic);
    };

    return (
        <form className="generation-form" onSubmit={handleSubmit}>
            <input
                className="generation-input"
                type="text"
                placeholder="Enter your video topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={loading}
            />
            <button
                className="generation-button"
                type="submit"
                disabled={loading || !topic.trim()}
            >
                {loading ? 'Generating...' : 'Generate Idea'}
            </button>
        </form>
    );
};

export default IdeaGeneratorForm; 