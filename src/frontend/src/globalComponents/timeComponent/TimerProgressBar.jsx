import React, { useState, useEffect } from 'react';
import './TimerProgressBar.css'; // Vergeet niet je nieuwe CSS-bestand te importeren

const TimerProgressBar = ({ timeValue, finished}) => {

  const [seconds, setSeconds] = useState(timeValue);
  const [percentage, setPercentage] = useState(100);

  useEffect(() => {

    if (seconds > 0) {
      const intervalId = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
        setPercentage((seconds / timeValue) * 100);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [seconds, timeValue]);

  // Functie om de juiste kleurklasse te bepalen
  const getProgressBarClass = () => {
    if (seconds === 0) {
      finished(false);
    }
    return percentage > 50 ? 'green' : percentage > 25 ? 'orange' : 'red';
  };

  return (
    <div className="progressBarContainer">
      <div className={`progressBar ${getProgressBarClass()}`} style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

export default TimerProgressBar;
