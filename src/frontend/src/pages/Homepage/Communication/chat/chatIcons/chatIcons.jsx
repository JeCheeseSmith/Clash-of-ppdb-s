import React, {useEffect, useState} from 'react';
import './chatIcons.css'
import AvatarWithName from "../../../../../globalComponents/avatarWithName/avatarWithName.jsx";
import GET from "../../../../../api/GET.jsx";
import {useLocation} from "react-router-dom";

function ChatIcons({contactList, updateMessages, updateReceiver, updateTypeReceiver, chatVisible})
{
    const location = useLocation();
    const username = location.state.username || {};
    const [selectedContact, setSelectedContact] = useState({type:"admin", name:"admin"})
    const update = (data, name, type) =>
    {
        updateMessages(data)
        updateReceiver(name)
        updateTypeReceiver(type)
    }
    const retrieveMessages = async (name, type) =>
    {
        if (type === "clan")
        {
            const data = await GET({"pname":username, "cname":name}, "/groupchat")
            update(data,name,type)
        }
        else if (type === "person")
        {
            const data = await GET({"pname":username, "sname":name}, "/chat")
            update(data,name,type)
        }
        if (name === "admin")
        {
            updateReceiver("")
        }
    }

    useEffect(() =>
    {
        let intervalId;

        if (selectedContact && chatVisible)
        {
            intervalId = setInterval(() =>
            {
                retrieveMessages(selectedContact.name, selectedContact.type);
            }, 1000);
        }

        return () => clearInterval(intervalId);
    }, [selectedContact, chatVisible]);

    return (
        <div className={"contact-list"}>
            {
                Object.entries(contactList).map(([name, type]) => (
                    <button className={"icons"} key={name} onClick={() => {setSelectedContact({ name, type }); retrieveMessages(name, type)}}>
                        {type === "person" && <AvatarWithName type={"chat-person"} name={name}/>}
                        {type === "clan" && <AvatarWithName type={"chat-group"} name={name}/>}
                    </button>
                ))
            }
        </div>
    );
}

export default ChatIcons;