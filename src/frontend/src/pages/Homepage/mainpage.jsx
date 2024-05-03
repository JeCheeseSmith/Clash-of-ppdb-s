import React, {useEffect, useMemo, useRef, useState} from 'react'; // Importing React library
import './mainpage.css'; // Importing the CSS file for styling
import Chat from './Communication/chat/chat.jsx';
import SocialBox from "./Communication/social/social.jsx";
import Grid from "./GridBuilder/GridView/grid3D.jsx";
import Buildmenu from "./GridBuilder/BuildMenu/buildmenu.jsx";
import ResourceBar from "./RecourceBar/resourcebar.jsx";
import Account from "./Account/account.jsx";
import * as API from "../../api/EndPoints/EndPoints.jsx"
import {useLocation} from "react-router-dom";
import MapButton from "./MapButton/mapButton.jsx";
import backgroundMusic from "../../globalComponents/audioComponent/assets/BackgroundMusic.mp3"
import LocalTimers from "../../globalComponents/backgroundFunctions/localTimers.jsx";
import Level from "./Level/Level.jsx";
import QuestButton from "./Quest/Quest.jsx";
import Leaderboard from "./Leaderbord/leaderboard.jsx";
import WheelOfFortune from "./Wheeloffortune/wheel.jsx";
import SoldierMenu from "./SoldierMenu/soldierMenu.jsx";
import {AddXP} from "./Level/Level.jsx";


/**
 * Functional component representing the main page of the application.
 * Displays a full-bleed background image.
 */
function MainPage()
{
    const { sid, username } = useLocation().state;
    const [buildings, setBuildings] = useState([])
    const [resources, setResources] = useState({wood: 0,stone: 0,steel: 0,food: 0});
    const [timers, setTimers] = useState([])
    const randomArray = useMemo(getRandomArray, []); // Memoize the random array
    const [flag, setFlag] = useState(true);

    const addBuilding = (type, position, size, occupiedCells) =>
    {
        setBuildings([...buildings, {type, position, size, occupiedCells}]);
        AddXP(200, username);
        setFlag(true);

    }
    const updateTimers = () =>
    {
        API.update(username).then(data => {setTimers(data)})
    }
    const getTimer = (ID, type) =>
    {
        if (type === "building" || type === "soldier")
        {
            let duration = [false, 0, 0]
            for (let timer of timers)
            {
                if (timer.ID[0] === ID[0] && timer.ID[1] === ID[1])
                {
                    return [true, timer.duration, timer.totalDuration]
                }
            }
            return duration
        }
    }
    const updateResources = () =>
    {
        API.get_resources(sid).then(data =>
        {
            setResources(data);
            console.log("Resource Updated: ", data, " at ",`${new Date().getHours()}h${new Date().getMinutes()}`)
        })
    }
    useEffect(() =>
    {
        API.getGrid(sid).then(data => setBuildings(data.grid))
    }, []);

    useEffect(() =>
    {
        //todo: compress size of main page mp3, or download new ones
        const audio = new Audio(backgroundMusic);
        audio.loop = true; // Loop the audio
        audio.play();
        return () =>
        {
            audio.pause(); // Pause the audio when component unmounts
        };
    }, [backgroundMusic]);
    return (
        <div className="mainpage">
            <Level username1={username} vlag={flag} changeVlag={setFlag}/>
            <QuestButton/>
            <Leaderboard/>
            <Chat/>
            <SocialBox/>
            <WheelOfFortune/>
            <Account/>
            <Buildmenu buildings={buildings} addBuilding={addBuilding} updateResources={updateResources}/>
            <div className={"grid"}>
                <Grid buildings={buildings} updateResources={updateResources} randomArray={randomArray} updateTimers={updateTimers} getTimer={getTimer}/>
            </div>
            <ResourceBar resources={resources} updateResources={updateResources}/>
            <MapButton/>
            <SoldierMenu setResources={setResources} timers={timers} setTimers={setTimers}/>
            <LocalTimers setResources={setResources} timers={timers} getTimer={getTimer}/>
        </div>
    );
}

function getRandomArray()
{
    const randomArray = [];
    for (let i = 0; i < 150; i++)
    {
        const randomNumber = Math.floor(Math.random() * 3) + 1;
        randomArray.push(randomNumber);
    }
    return randomArray
}

export default MainPage; // Exporting the MainPage component
