import React, {useState} from 'react';
import './wheel.css'




const WheelOfFortune = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [rotation, setRotation] = useState(0);
   const [showPopup, setShowPopup] = useState(false);
     const [prize, setPrize] = useState('');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const spinWheel = () => {
    const newValue = Math.ceil(Math.random() * 3600);
    const newRotation = (rotation + newValue)  // Limit rotation to 0-359 degrees
    setRotation(newRotation);
    const newPrize = getPrize(newRotation);
    setPrize(newPrize);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000); // Close popup after 3 seconds
};

  const getPrize = (angle) => {
    angle %= 360;
    const segmentAngle = 360 / 10; // Divide the wheel into 10 equal segments
    let prize = '';

    if (angle >= 0 && angle < segmentAngle) {
      prize = 'You won 100!';
    } else if (angle >= segmentAngle && angle < 2 * segmentAngle) {
      prize = 'You won 200!';
    } else if (angle >= 2 * segmentAngle && angle < 3 * segmentAngle) {
      prize = 'You won 300!';
    } else if (angle >= 3 * segmentAngle && angle < 4 * segmentAngle) {
      prize = 'You won 400!';
    } else if (angle >= 4 * segmentAngle && angle < 5 * segmentAngle) {
      prize = 'You won 500!';
    } else if (angle >= 5 * segmentAngle && angle < 6 * segmentAngle) {
      prize = 'You won 600!';
    } else if (angle >= 6 * segmentAngle && angle < 7 * segmentAngle) {
      prize = 'You won 700!';
    } else if (angle >= 7 * segmentAngle && angle < 8 * segmentAngle) {
      prize = 'You won 800!';
    } else if (angle >= 8 * segmentAngle && angle < 9 * segmentAngle) {
      prize = 'You won 900!';
    } else {
      prize = 'You won 1000!';
    }

    return prize;
  };
  return (
      <div>
        <button onClick={toggleMenu} className="toggle-wheel-button"></button>
        {isMenuOpen && (
            <div className={"maincontainer"}>
              <div className={"spin-button"} onClick={spinWheel}>Spin</div>
              <div className={"wheel-container"} style={{ transform: `rotate(${rotation}deg)` }}>
                <div className={"segments-wheel"} style={{ "--i": 1, "--clr": "#ff0000" }}><span>100</span></div>
                <div className={"segments-wheel"} style={{ "--i": 2, "--clr": "#ffff00" }}><span>200</span></div>
                <div className={"segments-wheel"} style={{ "--i": 3, "--clr": "#0000FF" }}><span>300</span></div>
                <div className={"segments-wheel"} style={{ "--i": 4, "--clr": "#008000" }}><span>400</span></div>
                <div className={"segments-wheel"} style={{ "--i": 5, "--clr": "#800080" }}><span>500</span></div>
                <div className={"segments-wheel"} style={{ "--i": 6, "--clr": "#dc143c" }}><span>600</span></div>
                <div className={"segments-wheel"} style={{ "--i": 7, "--clr": "#008b8b" }}><span>700</span></div>
                <div className={"segments-wheel"} style={{ "--i": 8, "--clr": "#ff8c00" }}><span>800</span></div>
                <div className={"segments-wheel"} style={{ "--i": 9, "--clr": "#ff1493" }}><span>900</span></div>
                <div className={"segments-wheel"} style={{ "--i": 10, "--clr": "#00bfff" }}><span>1000</span></div>
              </div>
            </div>
        )}
        {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>{prize}</p>
          </div>
        </div>
      )}
      </div>
  );
};



export default WheelOfFortune;


