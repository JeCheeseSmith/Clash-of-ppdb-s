import React, { useState, useEffect, useRef } from 'react';
import "./social.css"

function SocialBox() {
  const [socialVisible, setSocialVisible] = useState(false);
  const toggleSocialVisibility = () => {
    setSocialVisible(!socialVisible);
  };

  return (
      <div>
        <button onClick={toggleSocialVisibility} className={`toggle-social-button ${socialVisible ? 'visible' : 'hidden'}`}>
          {socialVisible ? 'social' : 'social'}
        </button>
        <div className={`social-container ${socialVisible ? 'visible' : 'hidden'}`}></div>
      </div>
  );
}
export default SocialBox;
