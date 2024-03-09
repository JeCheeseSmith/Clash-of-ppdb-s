import React, {useEffect, useState} from 'react';
import POST from "../../../../../api/POST.jsx";
import "./clanInfo.css"
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

function ClanInformation({name, description, status, pname, succes})
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
        <div className={"clan-info-button"}>
            <div className={"clan-container"}>
                <div className={"main-info"}>
                        <img src={succes ? clanPicture : notFound} alt={"clanPicture"} className={"clanPicture"}/>
                        <div className={"name-pname"}>
                            <div className={"name"}>{name}</div>
                            {succes && <div className={"pname"}>Clan Leader: {pname}</div>}
                        </div>
                </div>
                <div className={"extra-info"}>
                    <div className={"status"}>{status}</div>
                    <div className={"description"}>{description}</div>
                </div>
            </div>
            {succes && <button className={"clan-request-button"} onClick={handleRequestbutton}>Send Request</button>}
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