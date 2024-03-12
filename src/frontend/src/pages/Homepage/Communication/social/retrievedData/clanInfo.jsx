import React, {useEffect, useState} from 'react';
import POST from "../../../../../api/POST.jsx";
import "./clanInfo.css"
import clanPicture from "../../../../../assets/clanPicture.jpg";
import notFound from "../../../../../assets/groupnotfound.png";
import DisplayAvatarName from "../../../../../avatarWithName/avatarWithName.jsx";

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

function ClanInformation({name, description, status, pname, succesClanSearch})
{
    const [massage, setMassage] = useState("")
    const [succesRequest, setSuccesRequest] = useState(false)
    const handleRequestbutton = async () =>
    {
        const requestMassage = await POST({'cname': name, 'sender': "abu"}, "/joinClan")
        setMassage(requestMassage.message)
        setSuccesRequest(requestMassage.succes)
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSuccesRequest(false);
        }, 4000);

        // Clear the timeout when the component unmounts or when succesRequest changes
        return () => clearTimeout(timeout);
    }, [succesRequest]);

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
            {succesRequest && <RequestMassagePopUp massage={massage}/>}
        </div>
    )
}
function RequestMassagePopUp({ massage })
{
    return (
        <div className="popup-message">
            {massage}
        </div>
    );
}

export default ClanInformation;