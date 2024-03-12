import React from "react";
import './communication.css'

function CommunicationButton({type, buttonFunction, visible, buttonAudio})
{
    return (
        <div className={"buttons"}>
            {type === 'chat' && <ChatButton toggleChatVisibility={buttonFunction} chatVisible={visible}/>}
            {type === 'social' && <SocialButton toggleSocialVisibility={buttonFunction} playSocial={buttonAudio}/>}
        </div>
    )
}

function ChatButton({toggleChatVisibility, chatVisible})
{
    return(
        <button onClick={toggleChatVisibility} className={`toggle-chat-button ${chatVisible ? 'visible' : 'hidden'}`}>
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