import React, {useEffect} from 'react';
import './level.css'

// Code for level
function LevelBar({level, updateLevel, xp, updateXP}) {

    const xpPercentage = xp/10
    useEffect(() => {
    updateLevel();
    updateXP();
  }, []);

    return (
        <div className="level-xp-container">
            <div className="level-container">{level}</div>
            <div className="xp-bar-container">
                <div className="xp-bar" style={{width: `${xpPercentage}%`}}></div>
            </div>
        </div>
    );
}

export default LevelBar;




