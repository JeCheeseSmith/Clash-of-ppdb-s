import React, { useState } from 'react';
import './quest.css'

function QuestButton() {

    // Variable to check if the quest-button has been clicked, initially set to false
    const [click, setClick] = useState(false);

    // This function handles the quest-button click
    function HandleQuestClick() {
        setClick(!click);
    }

    return (
        <div className="quest-container">
            <button className="quest-button" onClick={HandleQuestClick}></button>
            {/* If click is true (quest-button has been clicked), then the quest log will open up */}
            {click && <QuestLog/>}
        </div>
    );
}

export default QuestButton;

// This function is for the quest-log
function QuestLog() {

    return (
        <div className="questpage-box">
          <div className="questpage-bar">Quest Log</div>
        </div>
  );
}


