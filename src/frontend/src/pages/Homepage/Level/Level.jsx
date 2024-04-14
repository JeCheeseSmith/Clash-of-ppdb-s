import React from 'react';
import './level.css'

// Code for level
function LevelBar() {

    // This variable represents the amount of xp you have
    const xpPercentage = 50;

    return (
        <div className="level-xp-container">
            <div className="level-container">1</div>
            <div className="xp-bar-container">
                <div className="xp-bar" style={{width: `${xpPercentage}%`}}></div>
            </div>
        </div>
    );
}

export default LevelBar;