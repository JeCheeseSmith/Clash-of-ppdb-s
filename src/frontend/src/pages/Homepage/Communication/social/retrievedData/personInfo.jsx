import React, {useEffect, useState} from 'react';
import POST from "../../../../../api/POST.jsx";
import "./personInfo.css"
import DisplayAvatarName from "../../../../../globalComponents/avatarWithName/avatarWithName.jsx";
import {useLocation} from "react-router-dom";
import RequestMassagePopUp from "../../../../../globalComponents/popupMessage/popup.jsx";

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

function PersonInformation({name, succesPersonSearch})
{
    const [message, setMessage] = useState("")
    const [popUp, setPopUp] = useState(false)
    const location = useLocation();
    const sender = location.state.username || {};
    const handleRequestbutton = async () =>
    {
        const requestMassage = await POST({'pname': name, 'sname': sender, 'content': "Care to be allies, noble adventurer?"}, "/sendfriendrequest")
        setPopUp(true)
        setMessage(requestMassage.message)
    }

    return(
        <div className={"player-info-request"}>
            <DisplayAvatarName type={"player-search"} name={name}/>
            <button className={"friend-request-button"} onClick={handleRequestbutton}>Send Friend Request</button>
            {popUp && <RequestMassagePopUp message={message} setPopup={setPopUp}/>}
        </div>
    )
}


export default PersonInformation;