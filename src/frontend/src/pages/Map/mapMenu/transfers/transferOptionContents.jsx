import React from "react";
import "./transferOptionContents.css"

/**
 * Component for social options.
 * @param {Object} props - The props object.
 * @param {string} props.pageName - The name of the page ('createClan', 'joinClan', 'requests', 'searchPerson').
 * @returns {JSX.Element} - The JSX for social options.
 */
function TransferOption({pageName})
{
    return(
        <div className={"option-content"}>
            {pageName === 'Transfer' && <TransferPage/>}
            {pageName === 'Attack' && <AttackPage/>}
            {pageName === 'Espionage' && <EspionagePage/>}
        </div>
    )
}

export default TransferOption;

function TransferPage()
{
    return (
        <div>
            TransferPage
        </div>
    )
}

function AttackPage()
{
    return (
        <div>
            AttackPage
        </div>
    )
}


function EspionagePage()
{
    return (
        <div>
            EspionagePage
        </div>
    )
}