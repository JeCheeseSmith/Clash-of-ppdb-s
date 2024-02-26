import React, {useState} from 'react';
import "./social.css"
import "./socialOptionContents.css"
import buttonSocial from '../../../assets/Menu Selection Sound Effect.mp3';
import buttonOption from '../../../assets/socialOptionSound.mp3';

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

function Box({socialVisible}){
    return(
        <div className="box-container">
            <Navbar socialVisible={socialVisible}/>
        </div>
    )
}

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

// Example page components
function CreateClanPage() {
  return (
      <div className={"create-clan"}>
          <input className={"nameClan"} placeholder={"Name"} />
          <select className={"clanStatus"} aria-placeholder={"status"} defaultValue="Status">
              <option value="option1">Online</option>
              <option value="option2">Offline</option>
              <option value="option3">Currently Building</option>
          </select>
          <textarea className={"descriptionClan"} placeholder={"Description"}/>
          <button className={"create-clan-button"}>Create Clan</button>
      </div>
  )
}

function JoinClanPage() {
    return (
        <div className={"create-clan"}>
          <input className={"nameClan"} placeholder={"Search Clan Name..."}/>
          <button className={"join-clan-button"}>Search Clan</button>
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

function SearchPersonPage() {
    return (
        <div className={"create-clan"}>
          <input className={"nameClan"} placeholder={"Search Name..."}/>
          <button className={"join-clan-button"}>Search Person</button>
        </div>
    )
}

