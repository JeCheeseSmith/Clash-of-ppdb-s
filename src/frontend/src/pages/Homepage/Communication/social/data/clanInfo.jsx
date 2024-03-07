import React, {useState} from 'react';
import "./clanInfo.css"
import clanPicture from "../../../../../assets/clanPicture.jpg";

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