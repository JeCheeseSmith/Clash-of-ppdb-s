import React from "react";
import './avatarWithName.css'
import avatar from "../assets/clanPicture.jpg";
import notFound from "../assets/groupnotfound.png";
import person from "../assets/person.png";
import group from "../assets/group.png";
function DisplayAvatarName({type, name, pname, succesClanSearch})
{
    return (
        <div>
            {type === 'player-request' && <PlayerRequest name={name}/>}
            {type === 'player-search' && <PlayerSearch name={name}/>}
            {type === 'clan-search' && <ClanSearch name={name} pname={pname} succes={succesClanSearch}/>}
            {type === 'chat-person' && <ChatPerson name={name}/>}
            {type === 'chat-group' && <ChatGroup name={name}/>}
        </div>
    )
}

export default DisplayAvatarName;

function PlayerRequest({name})
{
    return (
        <div className={"player-REQUEST"}>
            <img src={avatar} className={"player-REQUEST-avatar"}/>
            <div className={"player-REQUEST-name"}>{name}</div>
        </div>
    )
}

function PlayerSearch({name})
{
    return (
        <div className={"player-SEARCH"}>
            <img src={avatar} className={"player-SEARCH-avatar"}/>
            <div className={"player-SEARCH-name"}>{name}</div>
        </div>
    )
}

function ClanSearch({name, pname, succes}) {
    return (
        <div className={"clan-SEARCH"}>
            <img src={succes ? avatar : notFound} className={"clan-SEARCH-avatar"}/>
            <div className={"clan-SEARCH-NamePname"}>
                <div className={"clan-SEARCH-name"}>{name}</div>
                {succes && <div className={"clan-SEARCH-pname"}>Clan Leader: {pname}</div>}
            </div>
        </div>
    )
}

function ChatPerson({name})
{
    return (
        <div>
            <img src={person} className={"chat-ICON-avatar"}/>
            <h3>{name}</h3>
        </div>
    );
}

function ChatGroup({name})
{
    return (
        <div>
            <img src={group} className={"chat-ICON-avatar"}/>
            <h3>{name}</h3>
        </div>
    );
}