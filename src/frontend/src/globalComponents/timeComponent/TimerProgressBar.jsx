import React, { useState, useEffect } from 'react';
import './TimerProgressBar.css';

/**
 * Represents a timer progress bar component.
 * @param {object} props - The props object.
 * @param {number} props.timeValue - The current time value.
 * @param {number} props.totalTimeValue - The total time value.
 * @param {Function} props.finished - A function to indicate if the timer is finished.
 * @returns {JSX.Element} TimerProgressBar component.
 */

const TimerProgressBar = ({timeValue, totalTimeValue, finished}) => {

  const [seconds, setSeconds] = useState(timeValue);
  const [percentage, setPercentage] = useState((seconds / totalTimeValue) * 100);

  useEffect(() => {

    if (seconds > 0) {
      // seconds and percentage are updated every second as long as seconds > 0
      const intervalId = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
        setPercentage((seconds / totalTimeValue) * 100);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [seconds, timeValue]);

  const getProgressBarClass = () => {

    if (seconds === 0) {
      // Finished variable is set to false and is used in upgradeBuilding
      finished(false);
    }
    // As long as percentage > 50, the progressbar will be green
    if (percentage > 50) {
      return 'green';
    }
    // If percentage < 50 and > 25, the progressbar will be orange
    else if (percentage > 25) {
      return 'orange';
    }
    // If percentage < 25, the progressbar will be red
    else {
      return 'red';
    }
  };

  return (
    <div className="progressBarContainer">
      <div className={`progressBar ${getProgressBarClass()}`} style={{ width: `${percentage}%` }}>{seconds}</div>
    </div>
  );
};

export default TimerProgressBar;
