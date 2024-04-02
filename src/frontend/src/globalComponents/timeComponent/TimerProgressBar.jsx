import React, { useState, useEffect } from 'react';
import './TimerProgressBar.css'; // Vergeet niet je nieuwe CSS-bestand te importeren

const TimerProgressBar = ({timeValue, finished}) => {

  const [seconds, setSeconds] = useState(timeValue);
  const [percentage, setPercentage] = useState(100);

  useEffect(() => {

    if (seconds > 0) {
      // setSeconds and setPercentage are called every second as long as seconds > 0
      const intervalId = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
        setPercentage((seconds / timeValue) * 100);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [seconds, timeValue]);

  const getProgressBarClass = () => {
    if (seconds === 0) {
      // Finished variable is set to false and is used in upgradeBuilding
      finished(false);
    }
    if (percentage > 50) {
      return 'green';
    }
    else if (percentage > 25) {
      return 'orange';
    }
    else {
      return 'red';
    }
  };

  return (
    <div className="progressBarContainer">
      <div className={`progressBar ${getProgressBarClass()}`} style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

export default TimerProgressBar;
