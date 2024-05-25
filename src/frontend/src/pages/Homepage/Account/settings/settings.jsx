import React, { useState } from 'react';
import './settings.css';
import {setAudioSetting, audioSetting} from "../../../../globalComponents/audioComponent/audio.jsx";

const Settings = ({isBackgroundAudioEnabled, setIsBackgroundAudioEnabled, settings, setSettings}) =>
{
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const handleButtonsSoundsToggle = () =>
  {
      const newAudioSetting = !isAudioEnabled
      setIsAudioEnabled(newAudioSetting)
      setAudioSetting(newAudioSetting)
  };

  const handleBackgroundAudioToggle = () =>
  {
      setIsBackgroundAudioEnabled(!isBackgroundAudioEnabled)
  };

  return (
      <div className="settings-container">
          <h2>Game Settings</h2>
          <div className="setting">
              <label htmlFor="sound">Click Tones:</label>
              <button
                  id="sound"
                  onClick={handleButtonsSoundsToggle}
                  className={`toggle-button ${audioSetting ? 'on' : 'off'}`}
              >
                  {audioSetting ? 'On' : 'Off'}
              </button>
          </div>
          <div className="setting">
              <label htmlFor="sound">Background Ambience:</label>
              <button
                  id="sound"
                  onClick={handleBackgroundAudioToggle}
                  className={`toggle-button ${isBackgroundAudioEnabled ? 'on' : 'off'}`}
              >
                  {isBackgroundAudioEnabled ? 'On' : 'Off'}
              </button>
          </div>
          <button className="save-button" onClick={() => setSettings(!settings)}>Save Settings</button>
      </div>
  );
};

export default Settings;
