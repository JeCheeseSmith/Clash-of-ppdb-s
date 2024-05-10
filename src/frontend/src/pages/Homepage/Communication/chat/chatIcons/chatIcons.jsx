import React, {useEffect, useState} from 'react';
import './chatIcons.css'
import AvatarWithName from "../../../../../globalComponents/avatarWithName/avatarWithName.jsx";
import GET from "../../../../../api/GET.jsx";
import {useLocation} from "react-router-dom";
import PlaySound from "../../../../../globalComponents/audioComponent/audio.jsx";

function ChatIcons({contactList, messages, updateMessages, receiver, updateReceiver, updateTypeReceiver, chatVisible, setNewReport})
{
    const location = useLocation();
    const username = location.state.username || {};
    const [adminMessages, setAdminMessages] = useState(null);
    const [selectedContact, setSelectedContact] = useState(null);
    const messagesAreEqual = (oldMessages, newMessages) =>
    {
        return JSON.stringify(oldMessages) === JSON.stringify(newMessages);
    }
    const update = (data, name, type) =>
    {
        if (name === receiver && !messagesAreEqual(messages, data)) // new incoming messages on the current chat
        {
            updateMessages(data)
            updateReceiver(name)
            updateTypeReceiver(type)
            setSelectedContact({ name, type });

            const lastMessage = data[data.length - 1]
            if (lastMessage.sender !== username)
            {
                let promise  = PlaySound("NewMessage")
            }
        }
        else if (name !== receiver)
        {
            updateMessages(data)
            updateReceiver(name)
            updateTypeReceiver(type)
            setSelectedContact({ name, type });
        }
    }

    const retrieveMessages = async (name, type) =>
    {
        let data
        if (type === "clan")
        {
            data = await GET({"pname":username, "cname":name}, "/groupchat")
            update(data,name,type)
        }
        else if (type === "person")
        {
            data = await GET({"pname":username, "sname":name}, "/chat")
            update(data,name,type)
        }
        if (name === "admin")
        {
            setAdminMessages(data)
            updateReceiver("admin")
        }
    }

    const updateAdminMessages = async () =>
    {
        const data = await GET({"pname": username, "sname": "admin"}, "/chat")
        if (!messagesAreEqual(adminMessages, data) && !chatVisible)
        {
            if (adminMessages !== null)
            {
                let promise  = PlaySound("Report")
                setNewReport(true)
            }
            setAdminMessages(data)
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

    useEffect(() => // admin messages retrieved after each 10 minutes
    {
        let intervalId;
        updateAdminMessages()
        intervalId = setInterval(() =>
        {
            updateAdminMessages()
        }, 10*60*5000);
        return () => clearInterval(intervalId);
    }, [adminMessages, chatVisible]);

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