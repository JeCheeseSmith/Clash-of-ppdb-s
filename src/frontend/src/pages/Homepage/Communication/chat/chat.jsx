import React, {useEffect, useRef, useState} from 'react';
import POST from "../../../../api/POST.jsx";
import './chat.css';
import CommunicationButton from "../communication.jsx";
import ChatIcons from "./chatIcons/chatIcons.jsx";
import {useLocation} from "react-router-dom"; // CSS file for styling

/**
 * @brief Represents a chat box component with message display and input functionality.
 *
 * This component allows users to exchange messages in a chat interface.
 *
 * @returns {JSX.Element} JSX representation of the ChatBox component.
 */
function ChatBox()
{
    const [messages, setMessages] = useState(
        [
        {
            content:"Welcome to Chat!",
            sender:"Travisia",
            moment: "1605-05-21 15:43:55.754304"
        }
        ]
    ); // Initialize messages
    const [chatVisible, setChatVisible] = useState(false); // State variable to track chat visibility
    const [contactList, setContactList] = useState([])
    const [receiver, setReceiver] = useState("")
    const [typeReceiver, setTypeReceiver] = useState("")
    const [newReport, setNewReport] = useState(false);

    const handleMessageSubmit = (content, sender) =>
    {
        setMessages([...messages, {content, sender}]);
    };

    const toggleChatVisibility = () =>
    {
        setChatVisible(!chatVisible);
    };

    return (
        <div>
            <CommunicationButton type={"chat"}
                                 buttonFunction={toggleChatVisibility}
                                 visible={chatVisible}
                                 setVariable={setContactList}
                                 newReport={newReport}
                                 setNewReport={setNewReport}
            />
            <div className={`chat-container ${chatVisible ? 'visible' : 'hidden'}`}>
                <h1 className="chat-title">CHAT</h1>
                <MessageDisplay messages={messages} />
                {receiver !== "admin" && <MessageInput onSubmit={handleMessageSubmit} receiver={receiver} typeReceiver={typeReceiver}/>}
                <ChatIcons updateMessages={setMessages}
                           contactList={contactList}
                           updateReceiver={setReceiver}
                           updateTypeReceiver={setTypeReceiver}
                           chatVisible={chatVisible}
                           messages={messages}
                           receiver={receiver}
                           setNewReport={setNewReport}
                />
            </div>
        </div>
    );
}

/**
 * @brief Component to display messages in a chat interface.
 *
 * This component renders a list of messages in a chat interface.
 * It automatically scrolls to the bottom when new messages are added.
 *
 * @param {Object} props - Properties passed to the component.
 * @param {Array} props.messages - Array of message objects to be displayed.
 * @returns {JSX.Element} JSX representation of the MessageDisplay component.
 */

function MessageDisplay({ messages })
{
    const {username} = useLocation().state;
    const messageDisplayRef = useRef(null);
    useEffect(() =>
    {
        if (messageDisplayRef.current)
        {
          messageDisplayRef.current.scrollTop = messageDisplayRef.current.scrollHeight;
        }
    }, [messages]);
    const formatDate = (dateString) =>
    {
        const date = new Date(dateString);
        date.setHours(date.getHours() + 2);
        const formattedDate = date.toLocaleDateString();
        const options = { hour12: true, hour: 'numeric', minute: 'numeric' };
        let when = " at "
        const formattedTime = when + date.toLocaleTimeString(undefined, options);
        if (formattedDate !== "Invalid Date" && formattedTime !== "Invalid Date")
        {
            return { formattedDate, formattedTime };
        }
        else
        {
            return { formattedDate:"", formattedTime:"Just Now" };
        }
    };
    return (
        <div ref={messageDisplayRef} className="message-display">
            {messages.map((message, index) => {
                const senderName = message.sender === "admin" ? "Imperial Messenger" : message.sender;
                return (
                    <div key={index} className={`message ${message.sender === username ? 'sent' : 'received'}`}>
                        {message.sender === username &&
                            <div>
                                {message.content}
                                <div className={"message-time"}>
                                    {formatDate(message.moment).formattedDate}{formatDate(message.moment).formattedTime}
                                </div>
                            </div>}
                        {message.sender === username && <div className="you-name">you</div>}
                        {message.sender !== username && <div className="sender-name">{senderName}</div>}
                        {message.sender !== username &&
                            <div>
                                {message.content}
                                <div className={"message-time-receiver"}>
                                    {formatDate(message.moment).formattedDate}{formatDate(message.moment).formattedTime}
                                </div>
                            </div>}
                    </div>
                )
            })}
        </div>
    );
}

/**
 * @brief Component for entering and submitting messages in a chat interface.
 *
 * This component provides an input field for users to type and submit messages.
 * It triggers the onSubmit function when the Enter key is pressed.
 *
 * @param {Object} props - Properties passed to the component.
 * @param {Function} props.onSubmit - Function to handle message submission.
 * @returns {JSX.Element} JSX representation of the MessageInput component.
 */

function MessageInput({onSubmit, receiver, typeReceiver})
{
    const location = useLocation();
    const username = location.state.username || {};

    const [message, setMessage] = useState('');
    const handleInputChange = (e) =>
    {
        setMessage(e.target.value);
    };
    const handleKeyPress = async (e) =>
    {
        if (e.key === 'Enter' && message.trim() !== '') {
            onSubmit(message, username);
            if (typeReceiver === "person")
            {
                await POST({"content": message, "sname": username, "pname":receiver}, "/chat")
            }
            else
            {
                await POST({"content": message, "pname": username, "cname":receiver}, "/groupchat")
            }
            setMessage('');
        }
    };

    return (
        <input
            type="text"
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message and press Enter"
            className={`message-input ${message ? 'visible' : 'hidden'}`}
        />
    );
}

export default ChatBox;
