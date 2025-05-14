import React from 'react';
import './TabNavigation.css';

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div className="tab-navigation">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => onTabChange(tab.id)}
                >
                    {tab.name}
                </button>
            ))}
        </div>
    );
};

export default TabNavigation; 