import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
    // Mock data - replace with actual data from your backend
    const stats = {
        totalVideos: 24,
        pendingVideos: 5,
        completedVideos: 19,
        recentActivity: [
            { id: 1, title: 'Product Demo Video', status: 'Completed', date: '2024-03-20' },
            { id: 2, title: 'Tutorial Series', status: 'In Progress', date: '2024-03-19' },
            { id: 3, title: 'Marketing Campaign', status: 'Pending', date: '2024-03-18' },
        ]
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p className="welcome-text">Welcome back! Here's an overview of your content generation.</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Videos</h3>
                    <p className="stat-number">{stats.totalVideos}</p>
                </div>
                <div className="stat-card">
                    <h3>Pending Videos</h3>
                    <p className="stat-number">{stats.pendingVideos}</p>
                </div>
                <div className="stat-card">
                    <h3>Completed Videos</h3>
                    <p className="stat-number">{stats.completedVideos}</p>
                </div>
            </div>

            <div className="recent-activity">
                <h2>Recent Activity</h2>
                <div className="activity-list">
                    {stats.recentActivity.map(activity => (
                        <div key={activity.id} className="activity-item">
                            <div className="activity-info">
                                <h4>{activity.title}</h4>
                                <span className={`status-badge ${activity.status.toLowerCase()}`}>
                                    {activity.status}
                                </span>
                            </div>
                            <p className="activity-date">{activity.date}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="action-buttons">
                    <button className="btn btn-primary">Create New Video</button>
                    <button className="btn btn-secondary">View All Videos</button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 