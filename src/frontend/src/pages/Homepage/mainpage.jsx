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

/**
 * Functional component representing the main page of the application.
 * Displays a full-bleed background image.
 */
function MainPage()
{
    const { sid, username } = useLocation().state;
    const [buildings, setBuildings] = useState([])
    const [resources, setResources] = useState({wood: 0,stone: 0,steel: 0,food: 0});
    const randomArray = useMemo(getRandomArray, []); // Memoize the random array

    const updateResources = () =>
    {
        API.get_resources(sid).then(data =>
        {
            setResources(data);
            console.log("Resource Updated: ", data, " at ",`${new Date().getHours()}h${new Date().getMinutes()}`)
        })
    }
    const addBuilding = (type, position, size, occupiedCells) =>
    {
        setBuildings([...buildings, {type, position, size, occupiedCells}]);
    }

    /*useEffect(() =>
    {
        //todo: compress size of main page mp3, or download new ones
        const audio = new Audio(backgroundMusic);
        audio.loop = true; // Loop the audio
        audio.play();
        return () =>
        {
            audio.pause(); // Pause the audio when component unmounts
        };
    }, [backgroundMusic]);*/

    useEffect(() =>
    {
        API.getGrid(sid).then(data => setBuildings(data.grid))
        updateResources() // do this twice, because without the first time, resources are going to be 0
        const intervalId = setInterval(() =>
        {
            updateResources()
        }, 15 * 60 * 1000);
        return () => clearInterval(intervalId);
    }, []);
    return (
        <div className="mainpage">
            <Chat/>
            <SocialBox/>
            <Account/>
            <Buildmenu buildings={buildings} addBuilding={addBuilding} updateResources={updateResources}/>
            <div className={"grid"}>
                <Grid buildings={buildings} updateResources={updateResources} randomArray={randomArray}/>
            </div>
            <ResourceBar resources={resources} updateResources={updateResources}/>
            <MapButton/>
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
