import React, {useState} from "react";
import "./socialOptionContents.css"
import POST from "../../../../api/POST.jsx";
import ClanInformation from "./retrievedData/clanInfo.jsx";
import PersonInformation from "./retrievedData/personInfo.jsx";
import DisplayAvatarName from "../../../../globalComponents/avatarWithName/avatarWithName.jsx";
import {useLocation} from "react-router-dom";
import RequestMassagePopUp from "../../../../globalComponents/popupMessage/popup.jsx";

/**
 * Component for social options.
 * @param {Object} props - The props object.
 * @param {string} props.pageName - The name of the page ('createClan', 'joinClan', 'requests', 'searchPerson').
 * @param {Array} props.requests - Array of requests data (only required for 'requests' page).
 * @param {Function} props.sendData - Function to send data (only required for 'requests' page).
 * @returns {JSX.Element} - The JSX for social options.
 */
function SocialOption({pageName, requests, sendData})
{
    return(
        <div className="page-content">
            {pageName === 'createClan' && <CreateClanPage/>}
            {pageName === 'joinClan' && <JoinClanPage/>}
            {pageName === 'requests' && <RequestsPage requests={requests} sendDate={sendData}/>}
            {pageName === 'searchPerson' && <SearchPersonPage/>}
        </div>
    )
}

export default SocialOption;

function CreateClanPage()
{
    const location = useLocation();
    const clanLeader = location.state.username || {};
    const [clanName, setClanName] = useState("");
    const [clanDescription, setClanDescription] = useState("");
    const [clanStatus,setClanStatus] = useState("")
    const [popUp, setPopUp] = useState(false)
    const [popUpMessage, setPopUpMessage] = useState("")
    const handleclanName = (e) =>
    {
        setClanName(e.target.value);
    };
    const handleclanDescription = (e) =>
    {
        setClanDescription(e.target.value);
    };
    const handleClanStatus = (e) =>
    {
        setClanStatus(e.target.value);
    };
    const handleButtonClick = async () =>
    {
        const data = await POST({
            name: clanName,
            description: clanDescription,
            status: clanStatus,
            pname: clanLeader
        }, "/createClan");
        setPopUp(true)
        if (data.success)
        {
            setPopUpMessage("Clan Created!")
        }
        else
        {
            setPopUpMessage("Clan Could Not Be Created!")
        }
    };

    return (
        <div className={"social-primair-input"}>
            <input value={clanName} onChange={handleclanName} className={"search-name"} placeholder={"Name"} />
            <input value={clanStatus} onChange={handleClanStatus} className={"clanStatus"} placeholder={"clan chant"}/>
            <textarea value={clanDescription} onChange={handleclanDescription} className={"descriptionClan"} placeholder={"Description"}/>
            <button className={"create-clan-button"} onClick={handleButtonClick}>Create Clan</button>
            {popUp && <RequestMassagePopUp message={popUpMessage} setPopup={setPopUp}/>}
        </div>
    );
}

function JoinClanPage()
{
    const [clan, setClan] = useState("");
    const [clicked, setClicked] = useState(false);
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [status, setStatus] = useState("")
    const [pname, setPname] = useState("")
    const [succes, setSucces] = useState(false)
    const handleInputChange = (e) =>
    {
        setClan(e.target.value);
    };
    const handleButtonClick = async () =>
    {
        const data = await POST({name: clan}, "/searchClan");
        setName(data.name)
        setDescription(data.description)
        setStatus(data.status)
        setPname(data.pname)
        setSucces(data.success)
        setClicked(true)
    };
    return (
        <div className={"social-primair-input"}>
            <input value={clan} onChange={handleInputChange} className={"search-name"} placeholder={"Search Clan Name..."}/>
            <button className={"join-clan-button"} onClick={handleButtonClick} >Search Clan</button>
            {clicked && <ClanInformation name={name} description={description} status={status} pname={pname} succesClanSearch={succes}/>}
        </div>
    )
}


function RequestsPage({requests, sendDate})
{
    const location = useLocation();
    const username = location.state.username || {};
    const acceptationButton = async (request, state) =>
    {
        const accept = await POST({
            'id': request.id,
            "state": state,
            "pname": username,
            "sname": request.pname
        }, "/acceptgeneralrequests")
        sendDate();
    }

    return (
        <div className="requests-container">
            {
                requests.map(request => (
                    <div className={"request"}>
                        <DisplayAvatarName type={"player-request"} name={request.pname}/>
                        <div className={"content"}>{request.content}</div>
                        <button className={"request-accept"} onClick={() => acceptationButton(request, true)}>Accept</button>
                        <button className={"request-decline"} onClick={() => acceptationButton(request, false)}>Decline</button>
                    </div>
                ))
            }
        </div>
    );
}


function SearchPersonPage()
{
    const [person, setPerson] = useState("");
    const [success, setSuccess] = useState(false);
    const [searchPerson, setSearchPerson] = useState("")
    const handleInputChange = (e) => {
        setPerson(e.target.value);
    };
    const handleButtonClick = async () =>
    {
        const data = await POST({'pname':person}, "/searchPerson");
        setSuccess(data.success)
        setSearchPerson(person)
    };
    return (
        <div className={"social-primair-input"}>
            <input value={person} onChange={handleInputChange} className={"search-name"} placeholder={"Search Name..."}/>
            <button className={"search-friend-button"} onClick={handleButtonClick}>Search Person</button>
            {success ?
                <PersonInformation name={searchPerson} succesPersonSearch={success}/>
                :
                <div className={"search-friend-NotFound"}>PLAYER DOES NOT EXISTS</div>
            }
        </div>
    )
}