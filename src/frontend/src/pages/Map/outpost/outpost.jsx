import React from 'react';
import './outpost.css'

/**
 * Represents a component for creating an outpost.
 * @param {object} props - The props object.
 * @param {Function} props.onClickFunction - A function to handle the click event.
 * @returns {JSX.Element} Outpost component.
 */
function Outpost({onClickFunction})
{
    return (
        <div>
            <button className={"create-outpost-button"} onClick={onClickFunction}>Create Outpost</button>
        </div>
    );
}

export default Outpost;