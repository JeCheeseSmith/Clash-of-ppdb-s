import React, {useState} from 'react';
import './buildmenuOptionsContents.css'
import BuildingImages from "./assets/BuildingImages.jsx";
import GridCalculation from "../gridCalculation.jsx";

function BuildmenuOptionsContents({ currentPage, addBuildable, buildings, updateBuildings})
{
    return (
        <div className="type-container">
            <div className="image-scroll-container">
                {Object.entries(BuildingImages).map(([category, buildables]) => (
                    Object.entries(buildables).map(([name, [image, size]]) =>
                    {
                        return (
                            currentPage === category &&
                            <Building
                                key={`${category}-${name}`}
                                addBuildable={addBuildable}
                                name={name}
                                image={image}
                                size={size}
                                buildings={buildings}
                                updateBuildings={updateBuildings}
                            />
                        );
                    })
                ))}
            </div>
        </div>
    );
}

/**
 * Building component function definition.
 * This component represents a building.
 * @param {Object} props - Properties passed to the component.
 * @param {Function} props.addBuildable - Function to build a type.
 * @param {string} props.name - Name of the building.
 * @param {string} props.image - Image of the building.
 * @returns {JSX.Element} JSX representation of the Building component.
 */

function Building({addBuildable, name, image, size, buildings, updateBuildings})
{
    const getRandomPosition = () =>
    {
        return [Math.floor(Math.random() * 36) + 2, Math.floor(Math.random() * 36) + 2];
    }
    const [showTooltip, setShowTooltip] = useState(false);
    const handleMouseEnter = () =>
    {
        setShowTooltip(true);
    };
    const handleMouseLeave = () =>
    {
        setShowTooltip(false);
    };
    const handleImageChoice = () =>
    {
        let occupiedCells = []
        let selected = true
        let randomPosition = 0
        let selectedBuilding = []
        let newCells = [false,[]]
        while (newCells[0] === false)
        {
            randomPosition = getRandomPosition()
            selectedBuilding = [{name, randomPosition, size, occupiedCells},selected]
            newCells = GridCalculation(buildings, updateBuildings, selectedBuilding, randomPosition)
        }
        addBuildable(name, randomPosition, size, newCells[1])
    }
    return (
        <div className="building-container">
            <img
                src={image}
                className="small-image"
                onClick={handleImageChoice}
                alt={name}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />
            {showTooltip && <div className="tooltip">{name}</div>}
        </div>
    );
}

export default BuildmenuOptionsContents;