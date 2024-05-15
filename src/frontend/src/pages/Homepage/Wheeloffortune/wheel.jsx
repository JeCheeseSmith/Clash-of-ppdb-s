import React, {useEffect, useState} from 'react';
import './wheel.css'
import GET from "../../../api/GET.jsx";
import * as API from "../../../api/EndPoints/EndPoints.jsx";
import POST from "../../../api/POST.jsx";



function WheelOfFortune ({username1,sid1}) {

  // Variable to check if the toggle-leaderboard-button has been clicked, initially set to false
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Variable to set the rotation, initially set to 0
  const [rotation, setRotation] = useState(0);
  // Variable to set the popup(prize) true or false, initially set to false
  const [showPrize, setShowPrize] = useState(false);
  // Variable to set the prize itself, initially an empty string
  const [prize, setPrize] = useState('');
  const [canSpin, setCanSpin] = useState();


  // This function handles the toggle-wheel-button click
  const toggleMenu = async () => {
    setIsMenuOpen(true)

  };


  // This is made for the spin of the wheel
   const spinWheel = async () => {
     const info = await Wheelinfo(username1);
     if (info) {
       const newValue = Math.ceil(Math.random() * 3600);
       const newRotation = rotation + newValue;
       setRotation(newRotation);
       setShowPrize(false);

       setTimeout(() => {
         setIsMenuOpen(false);
         setShowPrize(true);
       }, 7000);

       setTimeout(() => {
         setShowPrize(false);
       }, 8000);

       setTimeout(async () => {
         const arrowAngle = (390 - (newRotation % 360)) % 360;
         const newPrize = getPrize(arrowAngle);
         setPrize(newPrize);
         await POST({sid1, username1, newPrize}, '/wheelOFfortune')
       }, 5000);

       setCanSpin(false);
     } else {
       setIsMenuOpen(false)
       alert("You can only spin the wheel once a day.");
     }
   };

  // Function to calculate the prize with an angle and with the given segments we used in the wheel
  const getPrize = (angle) => {
    const segmentAngle=360/10;
    let prize='';

    // Assign prizes based on the angle
    if(angle>=0&&angle<segmentAngle){
      prize='You won 1000 wood!';
    } else if (angle >= segmentAngle && angle < 2 * segmentAngle) {
      prize = 'You won 1000 stone!';
    } else if (angle >= 2 * segmentAngle && angle < 3 * segmentAngle) {
      prize = 'You won 1000 food!';
    } else if (angle >= 3 * segmentAngle && angle < 4 * segmentAngle) {
      prize = 'You won 1000 metal!';
    } else if (angle >= 4 * segmentAngle && angle < 5 * segmentAngle) {
      prize = 'You won 200 gems!';
    } else if (angle >= 5 * segmentAngle && angle < 6 * segmentAngle) {
      prize = 'You won 150 xp!';
    } else if (angle >= 6 * segmentAngle && angle < 7 * segmentAngle) {
      prize = 'You won 1000 gems';
    } else if (angle >= 7 * segmentAngle && angle < 8 * segmentAngle) {
      prize = 'Level up';
    } else if (angle >= 8 * segmentAngle && angle < 9 * segmentAngle) {
      prize='bad luck!';
    }else {
      prize = 'Jackpot';
    }
    return prize;
  };

  return (
      <div>
        <button onClick={toggleMenu} className="toggle-wheel-button"></button>
        {/* If click is true (toggle-wheel-button has been clicked), then the leaderboard will open up */}
        {isMenuOpen && (
            <div className={"spin-container"}>
              <div className={"spin-button"} onClick={spinWheel}>Spin</div>
              {/* So here when spin-button is clicked the wheel will spin and update the rotation */}
              <div className={"wheel-container"} style={{ transform: `rotate(${rotation}deg)` }}>
                {/* Wheel is divided in ten segments with ten prizes to win (every segment has it color) */}
                <div className={"segments-wheel"} style={{ "--i": 1, "--clr": "#ff0000" }}><span>1000 wood</span></div>
                <div className={"segments-wheel"} style={{ "--i": 2, "--clr": "#ffff00" }}><span>1000 stone</span></div>
                <div className={"segments-wheel"} style={{ "--i": 3, "--clr": "#0000FF" }}><span>1000 food</span></div>
                <div className={"segments-wheel"} style={{ "--i": 4, "--clr": "#008000" }}><span>1000 metal</span></div>
                <div className={"segments-wheel"} style={{ "--i": 5, "--clr": "#800080" }}><span>200 gems</span></div>
                <div className={"segments-wheel"} style={{ "--i": 6, "--clr": "#dc143c" }}><span>150 xp</span></div>
                <div className={"segments-wheel"} style={{ "--i": 7, "--clr": "#008b8b" }}><span>1000 gems</span></div>
                <div className={"segments-wheel"} style={{ "--i": 8, "--clr": "#ff8c00" }}><span>Level up</span></div>
                <div className={"segments-wheel"} style={{ "--i": 9, "--clr": "#ff1493" }}><span>bad luck</span></div>
                <div className={"segments-wheel"} style={{ "--i": 10, "--clr": "#00bfff" }}><span>Jackpot</span></div>
              </div>
            </div>
        )}
        {/* So when the spin is finished with spinning then the spin wil go away and the prize will be show as a popup */}
        {showPrize && (
        <div className="prize">
          <div className="prize-content">
            <p>{prize}</p>
          </div>
        </div>
      )}
      </div>
  );
}

export default WheelOfFortune;

export const Wheelinfo = (username) => {
    return API.Wheelcheck(username).then(data => data.bool);
};



