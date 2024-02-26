// GridComponent.js
import React, { useState } from 'react';
import './grid.css';

function Grid(){
    return (
        <div className="grid">
          <GridComponent numRows={28} numCols={28}/> {/* Adjust based on your requirements */}
        </div>
    )
}

const GridComponent = ({ numRows, numCols }) => {
    // State to track which items are clicked
    const [clickedItems, setClickedItems] = useState([]);

    // Function to handle click on grid item
    const handleClick = (i, j) => {
        // Toggle clicked state
        const itemKey = `${i}-${j}`;
        setClickedItems(prevClickedItems => {
            if (prevClickedItems.includes(itemKey)) {
                return prevClickedItems.filter(item => item !== itemKey);
            } else {
                return [...prevClickedItems, itemKey];
            }
        });
    };

    // Generating grid items
    const gridItems = [];
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            const className = (i + j) % 2 === 0 ? 'light-green' : 'dark-green';
            const itemKey = `${i}-${j}`;
            const isClicked = clickedItems.includes(itemKey);
            const itemClassName = isClicked ? 'grid-item clicked' : `grid-item ${className}`;
            gridItems.push(<div key={itemKey} className={itemClassName} onClick={() => handleClick(i, j)}></div>);
        }
    }

    return (
        <div className="grid-container">
            {gridItems}
        </div>
    );
};

export default Grid;

