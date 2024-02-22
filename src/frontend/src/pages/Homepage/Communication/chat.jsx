import React from 'react';
import './chat.css';

function Chat() {
  return (
    <div className="chatName">
      <h1>CHAT</h1>
      <div className="grayRectangle">
        <input type="text" className="messageInput" placeholder="Type your message..."  />
      </div>
    </div>
  );
}

export default Chat;
