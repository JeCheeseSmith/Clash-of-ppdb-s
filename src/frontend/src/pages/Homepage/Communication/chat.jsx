import React, { useState, useEffect, useRef } from 'react';
import './chat.css'; // CSS file for styling

function ChatBox() {
  const [messages, setMessages] = useState([]); //
  const [chatVisible, setChatVisible] = useState(false); // State variable to track chat visibility

  const handleMessageSubmit = (message, senderName) => {
    setMessages([...messages, { senderName, message }]);
  };

  const toggleChatVisibility = () => {
    setChatVisible(!chatVisible);
  };

  return (
    <div>
      <button onClick={toggleChatVisibility} className={`toggle-chat-button ${chatVisible ? 'visible' : 'hidden'}`}>
        {chatVisible ? '<' : '>'}
      </button>
      <div className={`chat-container ${chatVisible ? 'visible' : 'hidden'}`}>
        <h1 className="chat-title">CHAT</h1>
        <MessageDisplay messages={messages} />
        <MessageInput onSubmit={handleMessageSubmit} />
      </div>
    </div>
  );
}

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
      maxLength={50}
      onChange={handleInputChange}
      onKeyPress={handleKeyPress}
      placeholder="Type a message and press Enter"
      className="message-input"
    />
  );
}

export default ChatBox;
