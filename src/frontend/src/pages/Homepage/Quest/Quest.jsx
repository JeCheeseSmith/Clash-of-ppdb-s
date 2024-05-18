import React, { useState } from 'react';
import './quest.css'
import {getAchieved} from "../../../api/EndPoints.jsx";
import {useLocation} from "react-router-dom";
import * as API from "../../../api/EndPoints.jsx";

function QuestButton() {

    // Variable to check if the quest-button has been clicked, initially set to false
    const [click, setClick] = useState(false);
    const [loaded, setLoaded] = useState(false)

    // This function handles the quest-button click
    function HandleQuestClick() {
        setClick(!click);
        setLoaded(true)
    }

    return (
        <div className="quest-container">
            <button className="quest-button" onClick={HandleQuestClick}></button>
            {/* If click is true (quest-button has been clicked), then the quest log will open up */}
            {click && <QuestLog loaded={loaded}/>}
        </div>
    );
}

export default QuestButton;

// This function is for the quest log
function QuestLog(loaded) {
    const [achievements, setAchieved] = useState([])
    const {sid, username} = useLocation().state

  React.useEffect(() => {
    if (loaded) {
      API.getAchieved(username)
        .then((data) => {
          setAchieved(data);
          console.log(data);
        })
        .catch((error) => {
          console.error('Error fetching achievements:', error);
        });
    }
  }, [loaded, username]);

    return (
        <div className="questpage-box">
            <div className="questpage-bar">Quest Log</div>
            <div className="questpage-text"> Here you can see your achievements! </div>
            <ul>
                {achievements.map((item, index) => (
                    <li key={index} className="questpage-text">
                        <strong>{item.aname} </strong>: {item.task}
                    </li>
                ))}
            </ul>
        </div>
    );
}



