import React, {useState} from "react";
import './communication.css'
import GET from "../../../api/GET.jsx";
import {useLocation} from "react-router-dom";
import PlaySound from "../../../globalComponents/audioComponent/audio.jsx";

/**
 * Component for communication buttons.
 * @param {Object} props - The props object.
 * @param {string} props.type - The type of communication button ('chat' or 'social').
 * @param {Function} props.buttonFunction - Function to handle button click event.
 * @param {boolean} props.visible - Flag indicating visibility of the button.
 * @param {Object} props.buttonAudio - Audio object for button sound (only required for social buttons).
 * @param {Function} props.setVariable - Function to set a variable (only required for chat buttons).
 * @returns {JSX.Element} - The JSX for communication buttons.
 */
function CommunicationButton({type, buttonFunction, visible, setVariable, newReport, setNewReport})
{
    return (
        <div className={"buttons"}>
            {type === 'chat' && <ChatButton toggleChatVisibility={buttonFunction}
                                            chatVisible={visible}
                                            setContactList={setVariable}
                                            newReport={newReport}
                                            setNewReport={setNewReport}

            />}
            {type === 'social' && <SocialButton toggleSocialVisibility={buttonFunction}/>}
        </div>
    )
}

/**
 * Component for chat button.
 * @param {Object} props - The props object.
 * @param {Function} props.toggleChatVisibility - Function to toggle chat visibility.
 * @param {boolean} props.chatVisible - Flag indicating chat visibility.
 * @param {Function} props.setContactList - Function to set the contact list.
 * @returns {JSX.Element} - The JSX for chat button.
 */
function ChatButton({toggleChatVisibility, chatVisible, setContactList, newReport, setNewReport})
{
    const username = useLocation().state.username || {};
    const updateContactList = async () =>
    {
        const data = await GET({"pname":username},"/getChats")
        setContactList(data)
        let promise  = PlaySound("Click")
    }

    return(
        <button onClick={() => {toggleChatVisibility(); updateContactList(); setNewReport(false)}} className={`toggle-chat-button ${chatVisible ? 'visible' : 'hidden'}`}>
            {!chatVisible && newReport ? 'Reports!' : 'Chat'}
        </button>
    )
}

/**
 * Component for social button.
 * @param {Object} props - The props object.
 * @param {Function} props.toggleSocialVisibility - Function to toggle social visibility.
 * @param {Function} props.playSocial - Function to play social audio.
 * @returns {JSX.Element} - The JSX for social button.
 */
function SocialButton({toggleSocialVisibility}) {
    let promise;
    return (
        <button onClick={() => {toggleSocialVisibility(); promise = PlaySound("SocialButton")}} className={"toggle-social-button"}>
            Social
        </button>
    )
}

export default CommunicationButton;