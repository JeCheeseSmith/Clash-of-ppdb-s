import React, {useEffect, useState} from 'react';
import POST from "../../../../../api/POST.jsx";
import "./clanInfo.css"
import DisplayAvatarName from "../../../../../globalComponents/avatarWithName/avatarWithName.jsx";
import {useLocation} from "react-router-dom";
import PopUp from "../../../../../globalComponents/popupMessage/popup.jsx";

/**
 * Represents a component for displaying information about a clan.
 * @param {Object} props - The props passed to the component.
 * @param {string} props.name - The name of the clan.
 * @param {string} props.description - Description or information about the clan.
 * @param {string} props.status - Status of the clan.
 * @param {string} props.pname - The name of the clan leader.
 * @param {string} props.succesClanSearch - Message: Clan exists or not.
 * @returns {JSX.Element} - A React JSX element representing the clan information component.
 */

function ClanInformation({name, description, status, pname, succesClanSearch})
{
    const [message, setMessage] = useState("")
    const [popUp, setPopUp] = useState(false)
    const location = useLocation();
    const sender = location.state.username || {};
    const handleRequestbutton = async () =>
    {
        const requestMassage = await POST({'cname': name, 'sender': sender}, "/joinClan")
        setPopUp(true)
        setMessage(requestMassage.message)
    }

    return(
        <div className={"clan-infowithbutton"}>
            <div className={"clan-container"}>
                <DisplayAvatarName type={"clan-search"} name={name} pname={pname} succesClanSearch={succesClanSearch}/>
                <div className={"status-description"}>
                    <div className={"status"}>{status}</div>
                    <div className={"description"}>{description}</div>
                </div>
            </div>
            {succesClanSearch && <button className={"clan-request-button"} onClick={handleRequestbutton}>Send Request</button>}
            {popUp && <PopUp message={message} setPopup={setPopUp}/>}
        </div>
    )
}

export default ClanInformation;