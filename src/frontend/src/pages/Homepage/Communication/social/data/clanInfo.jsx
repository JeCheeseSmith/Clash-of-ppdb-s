import React, {useState} from 'react';
import "./clanInfo.css"
import clanPicture from "../../../../../assets/clanPicture.jpg";

/**
 * Represents a component for displaying information about a clan.
 * @param {Object} props - The props passed to the component.
 * @param {string} props.name - The name of the clan.
 * @param {string} props.description - Description or information about the clan.
 * @param {string} props.status - Status of the clan.
 * @param {string} props.pname - The name of the clan leader.
 * @param {string} props.success - Success: Clan exists or not.
 * @returns {JSX.Element} - A React JSX element representing the clan information component.
 */

function ClanInformation({name, description, status, pname, success}) {
    return(
        <div className={"clan-info-button"}>
            <div className={"clan-container"}>
                <div className={"main-info"}>
                    <img src={clanPicture} alt={"clanPicture"} className={"clanPicture"}/> <br/>
                    <div className={"name-pname"}>
                        <div className={"name"}>{name}</div>
                        <div className={"pname"}>{success} Clan Leader: {pname}</div>
                    </div>
                </div>
                <div className={"extra-info"}>
                    <div className={"status"}>{status}</div>
                    <div className={"description"}>{description}</div>
                </div>
            </div>
            <button className={"clan-request-button"}>Send Request</button>
        </div>
    )
}

export default ClanInformation;