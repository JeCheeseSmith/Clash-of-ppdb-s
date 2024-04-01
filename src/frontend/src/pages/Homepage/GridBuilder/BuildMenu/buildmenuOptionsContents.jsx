import React, {useState} from 'react';
import './buildmenuOptionsContents.css'
import Buildings from "../buildings.jsx";
import GridCalculation from "../gridCalculation.jsx";
import POST from "../../../../api/POST.jsx";

function BuildmenuOptionsContents({ currentPage, addBuildable, buildings})
{
    return (
        <div className="type-container">
            <div className="image-scroll-container">
                {Object.entries(Buildings).map(([category, buildables]) => (
                    Object.entries(buildables).map(([name, [image, Mesh, size]]) =>
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

function Building({addBuildable, name, image, size, buildings})
{
    const sid = localStorage.getItem('sid');
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
    const handleImageChoice = async () =>
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
            newCells = GridCalculation(buildings, selectedBuilding, randomPosition)
        }
        const data = await POST({"name":name, "position": randomPosition, "occupiedCells": occupiedCells, "sid": sid}, "/placeBuilding")
        console.log(data)
        if (true/*data.succes*/)
        {
            addBuildable(name, randomPosition, size, newCells[1])
        }
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