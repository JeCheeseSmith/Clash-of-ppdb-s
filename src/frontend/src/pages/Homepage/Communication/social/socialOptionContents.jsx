import React, {useState} from "react";
import "./socialOptionContents.css"
import POST from "../../../../api/POST.jsx";
import ClanInformation from "./retrievedData/clanInfo.jsx";
import PersonInformation from "./retrievedData/personInfo.jsx";
import DisplayAvatarName from "../../../../avatarWithName/avatarWithName.jsx";

function SocialOption({pageName, requests})
{
    return(
        <div className="page-content">
            {pageName === 'createClan' && <CreateClanPage/>}
            {pageName === 'joinClan' && <JoinClanPage/>}
            {pageName === 'requests' && <RequestsPage requests={requests}/>}
            {pageName === 'searchPerson' && <SearchPersonPage/>}
        </div>
    )
}

export default SocialOption;

function CreateClanPage()
{
    const [clanName, setClanName] = useState("");
    const [clanDescription, setClanDescription] = useState("");
    const [clanStatus,setClanStatus] = useState("")
    const [clanLeader, setClanLeader] = useState("watson")
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
    const handleclanLeader= (e) =>
    {
        setClanLeader(e.target.value);
    };
    const handleButtonClick = async () => {
        const data = await POST({
            name: clanName,
            description: clanDescription,
            status: clanStatus,
            pname: clanLeader
        }, "/createClan");
    };

    return (
        <div className={"social-primair-input"}>
            <input value={clanName} onChange={handleclanName} className={"search-name"} placeholder={"Name"} />
            <input value={clanStatus} onChange={handleClanStatus} className={"clanStatus"} placeholder={"clan chant"}/>
            <textarea value={clanDescription} onChange={handleclanDescription} className={"descriptionClan"} placeholder={"Description"}/>
            <button className={"create-clan-button"} onClick={handleButtonClick} >Create Clan</button>
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
        setSucces(data.succes)
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


function RequestsPage({ requests }) {
    return (
        <div className="requests-container">
            {
                requests.map(request => (
                    <div className={"request"}>
                        <DisplayAvatarName type={"player-request"} name={request.sendername}/>
                        <div className={"content"}>{request.content}</div>
                        <button className={"request-accept"}>Accept</button>
                        <button className={"request-decline"}>Decline</button>
                    </div>
                ))
            }
        </div>
    );
}


function SearchPersonPage() {
    const [person, setPerson] = useState("");
    const [clicked, setClicked] = useState(false);

    const handleInputChange = (e) => {
        setPerson(e.target.value);
    };
    const handleButtonClick = async () =>
    {
        const data = await POST({'name':person}, "/searchPerson");
        setClicked(true)
    };
    return (
        <div className={"social-primair-input"}>
            <input value={person} onChange={handleInputChange} className={"search-name"} placeholder={"Search Name..."}/>
            <button className={"search-friend-button"} onClick={handleButtonClick}>Search Person</button>
            {clicked && <PersonInformation name={"tempname"}/>}
        </div>
    )
}