import React from 'react';
import './chatIcons.css'
import AvatarWithName from "../../../../../avatarWithName/avatarWithName.jsx";
import GET from "../../../../../api/GET.jsx";
import {useLocation} from "react-router-dom";

function ChatIcons({contactList, updateMessages})
{
    const location = useLocation();
    const username = location.state.username || {};
    contactList = {"Raadin":"person", "Clan of lord Abu":"group", "Kars":"person"}
    const retrieveMessages = async (name, type) =>
    {
        if (type === "group")
        {
            const data = await GET({"pname":username, "cname":name}, "/groupchat")
            updateMessages(data)
        }
        else if (type === "person")
        {
            const data = await GET({"pname":username, "sname":name}, "/chat")
            updateMessages(data)
        }
    }

    return (
        <div className={"contact-list"}>
            {
                Object.entries(contactList).map(([name, type]) => (
                    <button className={"icons"} key={name} onClick={() => retrieveMessages(name, type)}>
                        {type === "person" && <AvatarWithName type={"chat-person"} name={name}/>}
                        {type === "group" && <AvatarWithName type={"chat-group"} name={name}/>}
                    </button>
                ))
            }
        </div>
    );
}

export default ChatIcons;