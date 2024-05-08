import React, {useEffect, useState} from 'react';
import './level.css'
import * as API from "../../../api/EndPoints/EndPoints.jsx";

// Code for level
function LevelBar({username1, vlag, changeVlag}) {

    const [level, setLevel] = useState(null);
    const [xp, setXp] = useState(null)

    useEffect(() => {
        //if (!vlag) return;

        const fetchData = async () => {
            try {
                const level = await requestLevel(username1);
                const xp = await requestXP(username1);
                setLevel(level);
                setXp(xp);
            } finally {
                changeVlag(false);
            }
        };

        fetchData();
    }, [vlag]);


    const xpPercentage = xp/10

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


export const requestLevel = (username) => {
    return API.getXPLevel(username).then(data => data.level);
};

export const requestXP = (username) => {
    return API.getXPLevel(username).then(data => data.xp);
};
