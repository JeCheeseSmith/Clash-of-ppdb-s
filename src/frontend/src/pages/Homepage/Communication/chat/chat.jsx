import React, {useEffect, useRef, useState} from 'react';
import './chat.css'; // CSS file for styling


/**
 * SendMessage function.
 * Sends a message to a specified endpoint using a POST request.
 * @param {Object} message - The message object to be sent.
 */

const SendMassege = async (massege) =>
{
    // Sends a message to the specified endpoint using a POST request
    await fetch('https://team8.ua-ppdb.me/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(massege)
    })
        .then(res => res.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
};

/**
 * @brief Represents a chat box component with message display and input functionality.
 *
 * This component allows users to exchange messages in a chat interface.
 *
 * @returns {JSX.Element} JSX representation of the ChatBox component.
 */
function ChatBox() {
  const [messages, setMessages] = useState([{ senderName: '', message: 'Welcome to Chat!' }]); // Initialize messages
  const [chatVisible, setChatVisible] = useState(false); // State variable to track chat visibility

  const handleMessageSubmit = (message, senderName) => {
    setMessages([...messages, { senderName, message }]);
    SendMassege({senderName,message})
  };

  const toggleChatVisibility = () =>
  {
    setChatVisible(!chatVisible);
  };

  return (
    <div>
      <button onClick={toggleChatVisibility} className={`toggle-chat-button ${chatVisible ? 'visible' : 'hidden'}`}>
        {chatVisible ? 'chat' : 'chat'}
      </button>
      <div className={`chat-container ${chatVisible ? 'visible' : 'hidden'}`}>
        <h1 className="chat-title">CHAT</h1>
        <MessageDisplay messages={messages} />
        <MessageInput onSubmit={handleMessageSubmit} />
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

function MessageDisplay({ messages }) {
  const messageDisplayRef = useRef(null);

  // Scroll to the bottom of the message display on component update
  useEffect(() => {
    if (messageDisplayRef.current) {
      messageDisplayRef.current.scrollTop = messageDisplayRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={messageDisplayRef} className="message-display">
      {messages.map((message, index) => (
        <div key={index} className="message">
          <div>{message.message}</div>
          <span className="sender-name">{message.senderName}</span>
        </div>
      ))}
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

function MessageInput({ onSubmit }) {
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && message.trim() !== '') {
      onSubmit(message, 'You'); // Replace 'YourName' with the actual sender's name
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
      className="message-input"
    />
  );
}

export default ChatBox;
