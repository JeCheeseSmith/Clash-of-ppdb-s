import React from 'react';
import './outpost.css'

function Outpost({onClickFunction})
{
    return (
        <div>
            <button className={"create-outpost-button"} onClick={onClickFunction}>Create Outpost</button>
        </div>
    );
}

export default Outpost;