import React, {useState} from "react";
import './communication.css'
import GET from "../../../api/GET.jsx";
import {useLocation} from "react-router-dom";

function CommunicationButton({type, buttonFunction, visible, buttonAudio, setVariable})
{
    return (
        <div className={"buttons"}>
            {type === 'chat' && <ChatButton toggleChatVisibility={buttonFunction}
                                            chatVisible={visible}
                                            setContactList={setVariable}

            />}
            {type === 'social' && <SocialButton toggleSocialVisibility={buttonFunction} playSocial={buttonAudio}/>}
        </div>
    )
}

function ChatButton({toggleChatVisibility, chatVisible, setContactList})
{
    const username = useLocation().state.username || {};
    const updateContactList = async () =>
    {
        const data = await GET({"pname":username},"/getChats")
        setContactList(data)
    }

    return(
        <button onClick={() => {toggleChatVisibility(); updateContactList()}} className={`toggle-chat-button ${chatVisible ? 'visible' : 'hidden'}`}>
            {chatVisible ? 'chat' : 'chat'}
        </button>
    )
}

function SocialButton({toggleSocialVisibility, playSocial}) {
    return (
        <button onClick={() => {toggleSocialVisibility(); playSocial();}} className={"toggle-social-button"}>
            social
        </button>
    )
}

export default CommunicationButton;