import React from 'react';
import './chatIcons.css'
import AvatarWithName from "../../../../../avatarWithName/avatarWithName.jsx";

function ChatIcons()
{
    const contactList = {"Raadin":"person", "Clan":"group", "Kars":"person"}

    return (
        <div className={"contact-list"}>
            {
                Object.entries(contactList).map(([name, type]) => (
                    <button className={"icons"} key={name}>
                        {type === "person" && <AvatarWithName type={"chat-person"} name={name}/>}
                        {type === "group" && <AvatarWithName type={"chat-group"} name={name}/>}
                    </button>
                ))
            }
        </div>
    );
}

export default ChatIcons;