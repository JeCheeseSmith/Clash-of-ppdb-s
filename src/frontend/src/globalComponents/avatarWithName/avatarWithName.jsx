import React from "react";
import './avatarWithName.css'
import avatar from "../../assets/clanPicture.jpg";
import notFound from "../../assets/groupnotfound.png";
import person from "../../assets/person.png";
import group from "../../assets/group.png";
import Buildings from "../../pages/Homepage/GridBuilder/buildings.jsx";

/**
 * Function to display avatar and name based on type.
 * @param {object} props - The props object.
 * @param {string} props.type - The type of display ('player-request', 'player-search', 'clan-search', 'chat-person', 'chat-group').
 * @param {string} props.name - The name to be displayed.
 * @param {string} [props.pname] - The clan leader's name (only required when type is 'clan-search').
 * @param {boolean} [props.succesClanSearch] - Flag indicating success of clan search (only required when type is 'clan-search').
 * @returns {JSX.Element} - The JSX for displaying avatar and name.
 */
function DisplayAvatarName({type, name, pname, succesClanSearch})
{
    return (
        <div>
            {type === 'player-request' && <PlayerRequest name={name}/>}
            {type === 'player-search' && <PlayerSearch name={name}/>}
            {type === 'clan-search' && <ClanSearch name={name} pname={pname} succes={succesClanSearch}/>}
            {type === 'chat-person' && <ChatPerson name={name}/>}
            {type === 'chat-group' && <ChatGroup name={name}/>}
            {type === 'building-selected' && <SelectedBuilding name={name}/>}
        </div>
    )
}

export default DisplayAvatarName;


/**
 * Component to display avatar and name for player request.
 * @param {object} props - The props object.
 * @param {string} props.name - The name to be displayed.
 * @returns {JSX.Element} - The JSX for displaying avatar and name for player request.
 */
function PlayerRequest({name})
{
    return (
        <div className={"player-REQUEST"}>
            <img src={avatar} className={"player-REQUEST-avatar"}/>
            <div className={"player-REQUEST-name"}>{name}</div>
        </div>
    )
}


/**
 * Component to display avatar and name for player search.
 * @param {object} props - The props object.
 * @param {string} props.name - The name to be displayed.
 * @returns {JSX.Element} - The JSX for displaying avatar and name for player search.
 */
function PlayerSearch({name})
{
    return (
        <div className={"player-SEARCH"}>
            <img src={avatar} className={"player-SEARCH-avatar"}/>
            <div className={"player-SEARCH-name"}>{name}</div>
        </div>
    )
}

/**
 * Component to display avatar and name for clan search.
 * @param {object} props - The props object.
 * @param {string} props.name - The name to be displayed.
 * @param {string} props.pname - The clan leader's name.
 * @param {boolean} props.succes - Flag indicating success of clan search.
 * @returns {JSX.Element} - The JSX for displaying avatar and name for clan search.
 */
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

/**
 * Component to display avatar and name for chat person.
 * @param {object} props - The props object.
 * @param {string} props.name - The name to be displayed.
 * @returns {JSX.Element} - The JSX for displaying avatar and name for chat person.
 */
function ChatPerson({name})
{
    return (
        <div>
            <img src={person} className={"chat-ICON-avatar"}/>
            <h3>{name}</h3>
        </div>
    );
}

/**
 * Component to display avatar and name for chat group.
 * @param {object} props - The props object.
 * @param {string} props.name - The name to be displayed.
 * @returns {JSX.Element} - The JSX for displaying avatar and name for chat group.
 */
function ChatGroup({name})
{
    return (
        <div>
            <img src={group} className={"chat-ICON-avatar"}/>
            <h3>{name}</h3>
        </div>
    );
}

function SelectedBuilding({name})
{
    let image;
    for (let category in Buildings)
    {
        for (let buildables in Buildings[category])
        {
            if (buildables === name)
            {
                image = Buildings[category][buildables][0]
            }
        }
    }
    return (
        <div className={"building-SELECTED"}>
            <h3 className={"building-SELECTED-name"}>{name}</h3>
            <img src={image} className={"building-SELECTED-avatar"}/>
        </div>
    );
}