import React from 'react';
import './tutorialButton.css'

function TutorialButton({setTutorial, setTutorialNumber}) {
    return (
        <button className={"tutorial-button"} onClick={() => {setTutorial(true); setTutorialNumber(0)}}>Guidance</button>
    );
}

export default TutorialButton;