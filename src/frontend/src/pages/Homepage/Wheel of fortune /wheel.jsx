import React, {useState} from 'react';
import './wheel.css'




const WheelOfFortune = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showPrize, setShowPrize] = useState(false);
  const [prize, setPrize] = useState('');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const spinWheel = () => {
    const newValue = Math.ceil(Math.random() * 3600);
    const newRotation = rotation + newValue;
    setRotation(newRotation);
    setShowPrize(false);
    setTimeout(() => {
    setIsMenuOpen(false);
    setShowPrize(true);
    }, 6000);
    setTimeout(() => {
     setShowPrize(false);
    }, 7000);
    setTimeout(() => {
      const arrowAngle = (390 - (newRotation % 360)) % 360;
      const newPrize = getPrize(arrowAngle);
      setPrize(newPrize);
    },5000);
};


  const getPrize = (angle) => {
    const segmentAngle = 360 / 10;
    let prize = '';

    if (angle >= 0 && angle < segmentAngle) {
      prize = 'You won 1000 wood!';
    } else if (angle >= segmentAngle && angle < 2 * segmentAngle) {
      prize = 'You won 1000 stone!';
    } else if (angle >= 2 * segmentAngle && angle < 3 * segmentAngle) {
      prize = 'You won 1000 food!';
    } else if (angle >= 3 * segmentAngle && angle < 4 * segmentAngle) {
      prize = 'You won 1000 metal!';
    } else if (angle >= 4 * segmentAngle && angle < 5 * segmentAngle) {
      prize = 'You won 1000 gems!';
    } else if (angle >= 5 * segmentAngle && angle < 6 * segmentAngle) {
      prize = 'You won Xp boost!';
    } else if (angle >= 6 * segmentAngle && angle < 7 * segmentAngle) {
      prize = 'You won Upgrade boost!';
    } else if (angle >= 7 * segmentAngle && angle < 8 * segmentAngle) {
      prize = 'You won Free soldier!';
    } else if (angle >= 8 * segmentAngle && angle < 9 * segmentAngle) {
      prize = 'You won Level up!';
    } else {
      prize = 'You won 2000 gems!';
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
                <div className={"segments-wheel"} style={{ "--i": 1, "--clr": "#ff0000" }}><span>1000 wood</span></div>
                <div className={"segments-wheel"} style={{ "--i": 2, "--clr": "#ffff00" }}><span>1000 stone</span></div>
                <div className={"segments-wheel"} style={{ "--i": 3, "--clr": "#0000FF" }}><span>1000 food</span></div>
                <div className={"segments-wheel"} style={{ "--i": 4, "--clr": "#008000" }}><span>1000 metal</span></div>
                <div className={"segments-wheel"} style={{ "--i": 5, "--clr": "#800080" }}><span>1000 gems</span></div>
                <div className={"segments-wheel"} style={{ "--i": 6, "--clr": "#dc143c" }}><span>Xp boost</span></div>
                <div className={"segments-wheel"} style={{ "--i": 7, "--clr": "#008b8b" }}><span>Upgrade boost</span></div>
                <div className={"segments-wheel"} style={{ "--i": 8, "--clr": "#ff8c00" }}><span>Free soldier</span></div>
                <div className={"segments-wheel"} style={{ "--i": 9, "--clr": "#ff1493" }}><span>Level up</span></div>
                <div className={"segments-wheel"} style={{ "--i": 10, "--clr": "#00bfff" }}><span>2000 gems</span></div>
              </div>
            </div>
        )}
        {showPrize && (
        <div className="prize">
          <div className="prize-content">
            <p>{prize}</p>
          </div>
        </div>
      )}
      </div>
  );
};



export default WheelOfFortune;


