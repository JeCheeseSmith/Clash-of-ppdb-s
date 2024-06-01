import React from 'react';
import './Information.css'


/**
 * A React functional component that displays information about the last update
 * and a feedback message for a game in development.
 *
 * @component
 * @example
 * return (
 *   <Information />
 * )
 */
function Information()
{
    return (
        <>
            <div className={"last-update"}>
                Last Update: 20/05/2024 13:35
            </div>
            <div className={"feedback"}>
                This Game is still in development, so if you encounter any problems or
                difficulties, we would be grateful for your feedback.
            </div>
        </>
    );
}

export default Information;