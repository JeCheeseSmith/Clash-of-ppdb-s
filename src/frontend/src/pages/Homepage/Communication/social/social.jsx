import React, {useState} from 'react';
import POST from "../../../../api/POST.jsx";
import "./social.css"
import SocialOption from "./socialOptionContents.jsx";
import CommunicationButton from "../communication.jsx";
import {useLocation} from "react-router-dom";
import PlaySound from "../../../../globalComponents/audioComponent/audio.jsx";

/**
 * React component representing a social box.
 *
 * @returns {JSX.Element} - The JSX element representing the social box.
 */
function SocialBox()
{
    const [socialVisible, setSocialVisible] = useState(false);
    const toggleSocialVisibility = () =>
    {
        setSocialVisible(!socialVisible);
    };

    return (
        <div>
            <CommunicationButton type={"social"} buttonFunction={toggleSocialVisibility}/>
            <div className="social-container"></div>
            <Box socialVisible={socialVisible}/>
        </div>
    );
}
export default SocialBox;


/**
 * Renders the box containing social options.
 *
 * @param {boolean} socialVisible - Determines whether the social options are visible.
 * @returns {JSX.Element} - The JSX element representing the box containing social options.
 */

function Box({socialVisible})
{
    return(
        <div className="box-container">
            <Navbar socialVisible={socialVisible}/>
        </div>
    )
}


/**
 * Renders the navbar with social options.
 *
 * @param {boolean} socialVisible - Determines whether the social options are visible.
 * @returns {JSX.Element} - The JSX element representing the navbar with social options.
 */
function Navbar({ socialVisible })
{
    const [currentPage, setCurrentPage] = useState('createClan');
    const location = useLocation();
    const pname = location.state.username || {};

    const handleButtonClick = (pageName) =>
    {
      setCurrentPage(pageName);
      let promise = PlaySound("SocialOptionButton");
    };

    const [requests, setRequests] = useState([]);
    const sendData = async () =>
    {
        handleButtonClick('requests');
        const data = await POST({'pname': pname}, "/getgeneralrequests");
        setRequests(data);
    }

    return (
        <div className="navbar-container">
            {socialVisible && (
                <nav className="navbar visible">
                    <ul className="navbar-links">
                        <li>
                            <button onClick={() => handleButtonClick('createClan')} className={"socialOption"}>Create Clan</button>
                        </li>
                        <li>
                            <button onClick={() => handleButtonClick('joinClan')} className={"socialOption"}>Join Clan</button>
                        </li>
                        <li>
                            <button onClick={() => sendData()} className={"socialOption"}>General Requests</button>
                        </li>
                        <li>
                            <button onClick={() => handleButtonClick('searchPerson')} className={"socialOption"}>Search Person</button>
                        </li>
                    </ul>
                </nav>
            )}
            {
                socialVisible && currentPage &&
                (<SocialOption pageName={currentPage} requests={requests} sendData={sendData}/>)
            }
        </div>
    );
}

