import React from 'react';
import './chatIcons.css'
import AvatarWithName from "../../../../../globalComponents/avatarWithName/avatarWithName.jsx";
import GET from "../../../../../api/GET.jsx";
import {useLocation} from "react-router-dom";

function ChatIcons({contactList, updateMessages, updateReceiver, updateTypeReceiver})
{
    const location = useLocation();
    const username = location.state.username || {};
    const retrieveMessages = async (name, type) =>
    {
        if (type === "clan")
        {
            const data = await GET({"pname":username, "cname":name}, "/groupchat")
            updateMessages(data)
            updateReceiver(name)
            updateTypeReceiver(type)
        }
        else if (type === "person")
        {
            const data = await GET({"pname":username, "sname":name}, "/chat")
            updateMessages(data)
            updateReceiver(name)
            updateTypeReceiver(type)
        }
        if (name === "admin")
        {
            updateReceiver("")
        }
    }

    return (
        <div className={"contact-list"}>
            {
                Object.entries(contactList).map(([name, type]) => (
                    <button className={"icons"} key={name} onClick={() => retrieveMessages(name, type)}>
                        {type === "person" && <AvatarWithName type={"chat-person"} name={name}/>}
                        {type === "clan" && <AvatarWithName type={"chat-group"} name={name}/>}
                    </button>
                ))
            }
        </div>
    );
}

export default ChatIcons;