import React, {useEffect, useMemo, useRef, useState} from 'react'; // Importing React library
import './mainpage.css'; // Importing the CSS file for styling
import Chat from './Communication/chat/chat.jsx';
import SocialBox from "./Communication/social/social.jsx";
import Grid from "./GridBuilder/GridView/grid3D.jsx";
import Buildmenu from "./GridBuilder/BuildMenu/buildmenu.jsx";
import ResourceBar from "./RecourceBar/resourcebar.jsx";
import Account from "./Account/account.jsx";
import * as API from "../../api/EndPoints.jsx"
import {useLocation} from "react-router-dom";
import MapButton from "./MapButton/mapButton.jsx";
import backgroundMusic from "../../globalComponents/audioComponent/assets/BackgroundMusic.mp3"
import tutorialBackgroundMusic from "../../globalComponents/audioComponent/assets/TutorialBackgroundMusic.mp3"
import LocalTimers from "../../globalComponents/backgroundFunctions/localTimers.jsx";
import Level from "./Level/Level.jsx";
import QuestButton from "./Quest/Quest.jsx";
import Leaderboard from "./Leaderbord/leaderboard.jsx";
import WheelOfFortune from "./Wheeloffortune/wheel.jsx";
import SoldierMenu from "./SoldierMenu/soldierMenu.jsx";
import {Loader} from "@react-three/drei";
import {loaderStyles} from "../../globalComponents/loadingScreen/loadingScreen.jsx";
import introVideo from '../../assets/IntroductionVideos/Travisia - Fallen Empire Intro Story.mp4'
import tutorialVideo0 from '../../assets/IntroductionVideos/Travisia - Fallen Empire Intro Tutorial.mp4'
import tutorialVideo1 from '../../assets/IntroductionVideos/Travisia - Fallen Empire Intro Tutorial 1.mp4'
import tutorialVideo2 from '../../assets/IntroductionVideos/Travisia - Fallen Empire Intro Tutorial 2.mp4'
import tutorialVideo3 from '../../assets/IntroductionVideos/Travisia - Fallen Empire Intro Tutorial 3.mp4'
import tutorialVideo4 from '../../assets/IntroductionVideos/Travisia - Fallen Empire Intro Tutorial 4.mp4'
import tutorialVideo5 from '../../assets/IntroductionVideos/Travisia - Fallen Empire Intro Tutorial 5.mp4'
import TutorialButton from "./TutorialButton/tutorialButton.jsx";

/**
 * Functional component representing the main page of the application.
 * This component serves as the primary interface for users, displaying various game elements,
 * communication features, and user interactions.
 *
 * The main page consists of:
 * - Grid view displaying buildings and game elements
 * - Build menu for constructing new buildings
 * - Resource bar showing available resources
 * - Chat and social features for player communication
 * - Account management for user settings and logout
 * - Quests, leaderboard, and other game-related functionalities
 * - Background music and tutorial elements
 *
 * @returns {JSX.Element} The JSX for the main page.
 */
function MainPage()
{
    const { sid, username, signUp} = useLocation().state;
    const [intro, setIntro] = useState(signUp)
    const signUpIntro = useRef(null);
    const [buildings, setBuildings] = useState([])
    const [resources, setResources] = useState({wood: 0,stone: 0,steel: 0,food: 0});
    const [timers, setTimers] = useState([])
    const randomArray = useMemo(getRandomArray, []); // Memorize the random array
    const [flag, setFlag] = useState(true);
    const [callForUpdate, setCallForUpdate] = useState(false)
    const [instantCallForUpdate, setInstantCallForUpdate] = useState(false)
    const [refresh, setRefresh] = useState(true)
    const [fadeIn, setFadeIn] = useState(false);
    const [isBackgroundAudioEnabled, setIsBackgroundAudioEnabled] = useState(true)
    const [tutorial, setTutorial] = useState(false)
    const [tutorialNumber, setTutorialNumber] = useState(0)
    const addBuilding = (type, position, size, occupiedCells) =>
    {
        setBuildings([...buildings, {type, position, size, occupiedCells}]);
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
    const handleTutorialNext = () =>
    {
        setTutorialNumber(tutorialNumber+1)
        if (tutorialNumber === 5)
        {
            setTutorial(false)
            setIntro(false);
        }
    }
    const handleTutorialPrevious = () =>
    {
        if (tutorialNumber > 0)
        {
            setTutorialNumber(tutorialNumber-1)
        }
    }
    useEffect(() =>
    {
        API.getGrid(sid).then(data => setBuildings(data.grid))
    }, []);
    useEffect(() =>
    {
        if (!intro && !tutorial && isBackgroundAudioEnabled)
        {
            const audio = new Audio(backgroundMusic);
            audio.loop = true; // Loop the audio
            audio.play();
            return () =>
            {
                audio.pause(); // Pause the audio when component unmounts
            };
        }
    }, [backgroundMusic, intro, isBackgroundAudioEnabled, tutorial]);
    useEffect(() =>
    {
        if (tutorial)
        {
            const audio = new Audio(tutorialBackgroundMusic);
            audio.loop = true; // Loop the audio
            audio.play();
            return () =>
            {
                audio.pause(); // Pause the audio when component unmounts
            };
        }
    }, [tutorialBackgroundMusic, tutorial]);
    useEffect(() =>
    {
        if (signUpIntro.current)
        {
            signUpIntro.current.addEventListener('ended', () =>
            {
                setTutorialNumber(0)
                setTutorial(true)
                setIntro(false)
            });
        }
    }, []);
    useEffect(() =>
    {
        if (!intro && !tutorial)
        {
            setFadeIn(true);
        }
    }, [intro, tutorial]);
    return (
        <div className="mainpage">
            <Loader {...loaderStyles} />
            {intro && <video src={introVideo} ref={signUpIntro} autoPlay={true}/>}
            {
                tutorial &&
                <>
                    <div className={"next-previous"}>
                        <button className={"next-button"} onClick={handleTutorialNext}>Next</button>
                        {tutorialNumber>0 && <button className={"previous-button"} onClick={handleTutorialPrevious}>Previous</button>}
                    </div>
                    {tutorialNumber === 0 && <video src={tutorialVideo0} autoPlay={true}/>}
                    {tutorialNumber === 1 && <video src={tutorialVideo1} autoPlay={true}/>}
                    {tutorialNumber === 2 && <video src={tutorialVideo2} autoPlay={true}/>}
                    {tutorialNumber === 3 && <video src={tutorialVideo3} autoPlay={true}/>}
                    {tutorialNumber === 4 && <video src={tutorialVideo4} autoPlay={true}/>}
                    {tutorialNumber === 5 && <video src={tutorialVideo5} autoPlay={true}/>}
                </>
            }
            {!intro && !tutorial &&
                <div className={`game fade-in ${fadeIn ? 'fade-in-visible' : ''}`}>
                    <Loader {...loaderStyles} />
                    <Level vlag={flag} changeVlag={setFlag}/>
                    <QuestButton/>
                    <Leaderboard/>
                    <Chat/>
                    <SocialBox/>
                    <WheelOfFortune username1={username} sid1={sid} setFlag={setFlag}
                                    setCallForUpdate={setInstantCallForUpdate}/>
                    <Account isBackgroundAudioEnabled={isBackgroundAudioEnabled} setIsBackgroundAudioEnabled={setIsBackgroundAudioEnabled}/>
                    <Buildmenu buildings={buildings} addBuilding={addBuilding} setCallForUpdate={setInstantCallForUpdate}/>
                    <div className={"grid"}>
                        <Grid buildings={buildings}
                              randomArray={randomArray}
                              getTimer={getTimer}
                              setCallForUpdate={setCallForUpdate}
                              setInstantCallForUpdate={setInstantCallForUpdate}
                        />
                    </div>
                    <ResourceBar resources={resources} refresh={refresh} refreshFunction={() => {
                        setCallForUpdate(true)
                        setRefresh(false)
                    }}
                    />
                    <MapButton/>
                    <TutorialButton setTutorial={setTutorial} setTutorialNumber={setTutorialNumber}/>
                    <SoldierMenu setResources={setResources} timers={timers} setTimers={setTimers}/>
                    <LocalTimers setResources={setResources}
                                 timers={timers}
                                 setTimers={setTimers}
                                 setFlag={setFlag}
                                 callForUpdate={callForUpdate}
                                 setCallForUpdate={setCallForUpdate}
                                 instantCallForUpdate={instantCallForUpdate}
                                 setInstantCallForUpdate={setInstantCallForUpdate}
                                 refresh={refresh}
                                 setRefresh={setRefresh}
                    />
                </div>
            }
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
