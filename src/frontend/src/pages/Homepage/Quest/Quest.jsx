import React, { useState } from 'react';
import './quest.css'

function QuestButton() {

    const [click, setClick] = useState(false);

    function HandleQuestClick() {
        setClick(!click);
    }

    return (
        <div className="quest-container">
            <button className="quest-button" onClick={HandleQuestClick}></button>
            {click && <QuestPageBox/>}
        </div>
    );
}

export default QuestButton;

function QuestPageBox() {

    return (
        <div className="questpage-box">
            <QuestPageBar/>
        </div>

    );
}

function QuestPageBar() {

    return (
        <div className="questpage-bar">
            <div className="bar-text">Questlog</div>
        </div>
    );
}

