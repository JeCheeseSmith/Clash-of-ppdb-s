import React, {useState} from 'react';
import './buildmenuOptionsContents.css'
import BuildingImages from "./assets/BuildingImages.jsx";

function BuildmenuOptionsContents({ currentPage, addBuildable })
{
    return (
        <div className="type-container">
            <div className="image-scroll-container">
                {Object.entries(BuildingImages).map(([category, buildings]) => (
                    Object.entries(buildings).map(([name, image]) =>
                    {
                        return (
                            currentPage === category && <Building addBuildable={addBuildable} name={name} image={image} />
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

function Building({addBuildable, name, image})
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
    return (
        <div className="building-container">
            <img
                src={image}
                className="small-image"
                onClick={() => addBuildable(name, getRandomPosition())}
                alt={name}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />
            {showTooltip && <div className="tooltip">{name}</div>}
        </div>
    );
}

export default BuildmenuOptionsContents;