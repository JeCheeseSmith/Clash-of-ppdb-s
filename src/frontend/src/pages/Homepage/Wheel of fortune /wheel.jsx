import React, {useState} from 'react';
import './wheel.css'




const WheelOfFortune = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const [spinning, setSpinning] = useState(false);



  const spinWheel = () => {
    if (spinning) return;

    setSpinning(true);

    // Simulate spinning for 5 seconds, adjust as needed
    setTimeout(() => {
      setSpinning(false);
      const prizes = ["1000 wood", "1000 metal", "1000 food", "1000 stone", "1000 xp", "free update"];
      const randomIndex = Math.floor(Math.random() * prizes.length);
      const prize = prizes[randomIndex];
      alert(`You won: ${prize}`);
    }, 5000);
  };

  const renderSegments = () => {
  const numSegments = 8;
  const segmentAngle = (2 * Math.PI) / numSegments;

  const segments = [];
  for (let i = 0; i < numSegments; i++) {
    const startAngle = i * segmentAngle;
    const endAngle = (i + 1) * segmentAngle;

    const startX = 50 + 40 * Math.cos(startAngle);
    const startY = 50 + 40 * Math.sin(startAngle);
    const endX = 50 + 40 * Math.cos(endAngle);
    const endY = 50 + 40 * Math.sin(endAngle);

    const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;

    const d = `M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;

    const textAngle = startAngle + (segmentAngle / 2);
    const textX = 50 + 30 * Math.cos(textAngle);
    const textY = 50 + 30 * Math.sin(textAngle);

    segments.push(
      <g key={i}>
        <path d={d} fill={`hsl(${i * (360 / numSegments)}, 50%, 50%)`} />
        <text x={textX} y={textY} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="5px">
          Prize {i + 1}
        </text>
      </g>
    );
  }

  return segments;
  };

  return (
      <div>
        <button onClick={toggleMenu} className="toggle-wheel-button">Wheel</button>
        {isMenuOpen && (
            <div className="wheel-container">
              <svg className={`wheel ${spinning ? 'spinning' : ''}`} viewBox="0 0 100 100">
                <g className="segments">
                  {renderSegments()}
                </g>
              </svg>
              <button className="spin-button" onClick={spinWheel}>
                <span className={`arrow ${spinning ? 'spin-animation' : ''}`}>&#x27f3;</span>
                Spin
              </button>
            </div>
        )}
      </div>
  );
};



export default WheelOfFortune;


