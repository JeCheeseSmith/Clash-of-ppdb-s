import React, {useState} from 'react';
import "./social.css"
import "./socialOptionContents.css"
import buttonSocial from '../../../assets/Menu Selection Sound Effect.mp3';
import buttonOption from '../../../assets/socialOptionSound.mp3';

/**
 * Sends data to a specified endpoint using a POST request.
 *
 * @param {Object} data - The data to be sent.
 * @param {string} endpoint - The endpoint to which the data is sent.
 * @returns {Promise<void>} - A Promise that resolves when the data is sent.
 */
const SocialBoxData = async (data, endpoint) =>
{
    await fetch('http://127.0.0.1:5000'+endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
};

/**
 * React component representing a social box.
 *
 * @returns {JSX.Element} - The JSX element representing the social box.
 */
function SocialBox() {
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

function Box({socialVisible}){
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
function Navbar({ socialVisible }) {
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

  return (
      <div className="navbar-container">
          {socialVisible && (
              <nav className="navbar visible">
                  <ul className="navbar-links">
                      <li>
                          <button onClick={() => handleButtonClick('createClan')} className={"socialOption"}>Create
                              Clan
                          </button>
                      </li>
                      <li>
                          <button onClick={() => handleButtonClick('joinClan')} className={"socialOption"}>Join Clan
                          </button>
                      </li>
                      <li>
                          <button onClick={() => handleButtonClick('friendRequests')} className={"socialOption"}>Friend
                              Requests
                          </button>
                      </li>
                      <li>
                          <button onClick={() => handleButtonClick('searchPerson')} className={"socialOption"}>Search
                              Person
                          </button>
                      </li>
                  </ul>
              </nav>
          )}
          {socialVisible && currentPage && (
              <div className="page-content">
                  {/* Render different pages based on currentPage state */}
                  {currentPage === 'createClan' && <CreateClanPage/>}
                  {currentPage === 'joinClan' && <JoinClanPage/>}
                  {currentPage === 'friendRequests' && <FriendRequestsPage/>}
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
    const handleButtonClick = () =>
    {
        SocialBoxData({name:clanName, description:clanDescription,status:clanStatus, pname: clanLeader}, "/createClan");
    };

    return (
        <div className={"create-clan"}>
            <input value={clanName} onChange={handleclanName} className={"nameClan"} placeholder={"Name"} />
            <input className={"clanStatus"} placeholder={"status"}/>
            <textarea value={clanDescription} onChange={handleclanDescription} className={"descriptionClan"} placeholder={"Description"}/>
            {/* Attach handleCreateClan function to onClick event of the button */}
            <button className={"create-clan-button"} onClick={handleButtonClick} >Create Clan</button>
        </div>
    );
}

function JoinClanPage() {
    
    const [clan, setClan] = useState("");
    const handleInputChange = (e) =>
    {
        setClan(e.target.value);
    };
    const handleButtonClick = () =>
    {
        SocialBoxData(clan, "/joinClan");
    };
    return (
        <div className={"create-clan"}>
          <input value={clan} onChange={handleInputChange} className={"nameClan"} placeholder={"Search Clan Name..."}/>
          <button className={"join-clan-button"} onClick={handleButtonClick} >Search Clan</button>
        </div>
    )
}

function FriendRequestsPage() {
    return (
        <div className={"friend-requests"}>
            No Friend Requests :(
        </div>
    )
}

function SearchPersonPage()
{
    const [person, setPerson] = useState("");

    const handleInputChange = (e) =>
    {
        setPerson(e.target.value);
    };
    const handleButtonClick = () =>
    {
        SocialBoxData(person, "/searchPerson");
    };
    return (
        <div className={"create-clan"}>
          <input value={person} onChange={handleInputChange} className={"nameClan"} placeholder={"Search Name..."}/>
          <button className={"search-friend-button"} onClick={handleButtonClick} >Search Person</button>
        </div>
    )
}

