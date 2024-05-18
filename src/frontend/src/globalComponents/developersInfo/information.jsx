import React from 'react';
import './Information.css'

function Information()
{
    return (
        <>
            <div className={"last-update"}>
                Last Update: 18/05/2024 16:00
            </div>
            <div className={"feedback"}>
                This Game is still in development, so if you encounter any problems or
                difficulties, we would be grateful for your feedback.
            </div>
        </>
    );
}

export default Information;