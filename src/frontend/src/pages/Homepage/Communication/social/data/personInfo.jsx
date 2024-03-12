import React, {useEffect, useState} from 'react';
import POST from "../../../../../api/POST.jsx";
import "./personInfo.css"
import clanPicture from "../../../../../assets/clanPicture.jpg";
import notFound from "../../../../../assets/groupnotfound.png";

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

function PersonInformation({name, succes})
{
    const [massage, setMassage] = useState("")
    const [succesRequest, setSuccesRequest] = useState(false)
    const handleRequestbutton = async () =>
    {
        const requestMassage = await POST({'cname': name, 'sender': "abu"}, "/sendfriendrequest")
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
        <div className={"player-info-request"}>
            <div className={"avatar-name"}>
                <img src={clanPicture} alt={"clanPicture"} className={"avatar"}/>
                <div className={"name"}>name</div>
            </div>
            <button className={"friend-request-button"}>Send Friend Request</button>
        </div>
    )
}

function RequestMassagePopUp({massage}) {
    return (
        <div className="popup-message">
            {massage}
        </div>
    );
}

export default PersonInformation;