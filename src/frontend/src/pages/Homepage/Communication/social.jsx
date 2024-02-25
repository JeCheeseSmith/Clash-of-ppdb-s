import React, {useState} from 'react';
import "./social.css"
import buttonSound from '../../../assets/Menu Selection Sound Effect.mp3';

function SocialBox() {
  const [socialVisible, setSocialVisible] = useState(false);
  const toggleSocialVisibility = () => {
    setSocialVisible(!socialVisible);
  };

  const playSound = () => {
    const sound = new Audio(buttonSound);
    sound.currentTime = 0.315;
    sound.play();
  };


  return (
      <div>
          <button onClick={() => { toggleSocialVisibility(); playSound(); }} className={"toggle-social-button"}> social </button>
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

function Navbar({socialVisible}) {
  return (
    <nav className={`navbar ${socialVisible ? 'visible' : 'hidden'}`}>
      <ul className="navbar-links">
        <li><a href="#">Create Clan</a></li>
        <li><a href="#">Join Clan</a></li>
        <li><a href="#">Friend Requests</a></li>
        <li><a href="#">Search Person</a></li>
      </ul>
    </nav>
  );
}
