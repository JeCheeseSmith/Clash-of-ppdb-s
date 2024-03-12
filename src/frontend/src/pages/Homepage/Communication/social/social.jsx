import React, {useEffect, useState} from 'react';
import POST from "../../../../api/POST.jsx";
import "./social.css"
import "./socialOptionContents.css"
import buttonSocial from '../../../../assets/Menu Selection Sound Effect.mp3';
import buttonOption from '../../../../assets/socialOptionSound.mp3';
import sendername from '../../../../assets/clanPicture.jpg'
import ClanInformation from "./data/clanInfo.jsx";
import PersonInformation from "./data/personInfo.jsx";

/**
 * React component representing a social box.
 *
 * @returns {JSX.Element} - The JSX element representing the social box.
 */
function SocialBox()
{
  const [socialVisible, setSocialVisible] = useState(false);
  const toggleSocialVisibility = () => {
    setSocialVisible(!socialVisible);
  };

  const playSocial = () => {
    const sound = new Audio(buttonSocial);
    sound.currentTime = 0.315;
    sound.play();
  };

  return (
      <div>
          <button onClick={() => { toggleSocialVisibility(); playSocial(); }} className={"toggle-social-button"}> social </button>
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

    const playOption = () => {
      const sound = new Audio(buttonOption);
      sound.currentTime = 0.5;
      sound.play();
    };

    const handleButtonClick = (pageName) => {
      setCurrentPage(pageName);
      playOption();
    };

    const [requests, setRequests] = useState([]);
    const sendData = async () =>
    {
        handleButtonClick('requests');
        const data = await POST({ 'player': "watson" }, "/getclanrequest");
        // Update the state using setRequests instead of pushing directly into the array
        setRequests([{sendername: data.sendername, content: data.content }]);
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
            {socialVisible && currentPage && (
                <div className="page-content">
                    {/* Render different pages based on currentPage state */}
                    {currentPage === 'createClan' && <CreateClanPage/>}
                    {currentPage === 'joinClan' && <JoinClanPage/>}
                    {currentPage === 'requests' && <RequestsPage requests={requests}/>}
                    {currentPage === 'searchPerson' && <SearchPersonPage/>}
                </div>
            )}
        </div>
    );
}

function CreateClanPage()
{
    const [clanName, setClanName] = useState("");
    const [clanDescription, setClanDescription] = useState("");
    const [clanStatus,setClanStatus] = useState("")
    const [clanLeader, setClanLeader] = useState("watson")
    const handleclanName = (e) =>
    {
        setClanName(e.target.value);
    };
    const handleclanDescription = (e) =>
    {
        setClanDescription(e.target.value);
    };
    const handleClanStatus = (e) =>
    {
        setClanStatus(e.target.value);
    };
    const handleclanLeader= (e) =>
    {
        setClanLeader(e.target.value);
    };
    const handleButtonClick = async () => {
        const data = await POST({
            name: clanName,
            description: clanDescription,
            status: clanStatus,
            pname: clanLeader
        }, "/createClan");
    };

    return (
        <div className={"social-primair-input"}>
            <input value={clanName} onChange={handleclanName} className={"search-name"} placeholder={"Name"} />
            <input value={clanStatus} onChange={handleClanStatus} className={"clanStatus"} placeholder={"clan chant"}/>
            <textarea value={clanDescription} onChange={handleclanDescription} className={"descriptionClan"} placeholder={"Description"}/>
            <button className={"create-clan-button"} onClick={handleButtonClick} >Create Clan</button>
        </div>
    );
}

function JoinClanPage()
{
    const [clan, setClan] = useState("");
    const [clicked, setClicked] = useState(false);
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [status, setStatus] = useState("")
    const [pname, setPname] = useState("")
    const [succes, setSucces] = useState(false)
    const handleInputChange = (e) =>
    {
        setClan(e.target.value);
    };
    const handleButtonClick = async () =>
    {
        const data = await POST({name: clan}, "/searchClan");
        setName(data.name)
        setDescription(data.description)
        setStatus(data.status)
        setPname(data.pname)
        setSucces(data.succes)
        setClicked(true)
    };
    return (
        <div className={"social-primair-input"}>
            <input value={clan} onChange={handleInputChange} className={"search-name"} placeholder={"Search Clan Name..."}/>
            <button className={"join-clan-button"} onClick={handleButtonClick} >Search Clan</button>
            {clicked && <ClanInformation name={name} description={description} status={status} pname={pname} succes={succes}/>}
        </div>
    )
}


function RequestsPage({ requests }) {
    return (
        <div className="requests-container">
            {
                requests.map(request => (
                    <div className={"request"}>
                        <div className={"avatar-sendername"}>
                            <img src={sendername} className={"avatar"}/>
                            <div className={"sendername"}>{request.sendername}</div>
                        </div>
                        <div className={"content"}>{request.content}</div>
                        <button className={"request-accept"}>Accept</button>
                        <button className={"request-decline"}>Decline</button>
                    </div>
                ))
            }
        </div>
    );
}


function SearchPersonPage() {
    const [person, setPerson] = useState("");
    const [clicked, setClicked] = useState(false);

    const handleInputChange = (e) => {
        setPerson(e.target.value);
    };
    const handleButtonClick = async () =>
    {
        const data = await POST({'name':person}, "/searchPerson");
        setClicked(true)
    };
    return (
        <div className={"social-primair-input"}>
            <input value={person} onChange={handleInputChange} className={"search-name"} placeholder={"Search Name..."}/>
            <button className={"search-friend-button"} onClick={handleButtonClick}>Search Person</button>
            <PersonInformation/>
        </div>
    )
}

