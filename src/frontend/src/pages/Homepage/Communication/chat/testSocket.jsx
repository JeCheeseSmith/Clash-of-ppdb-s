import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';

function ChatComponent() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');

    // Create a single Socket.IO connection
    const socket = socketIOClient('http://localhost:5173');

    useEffect(() => {
        // Event listeners for incoming messages
        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('message', (message) =>
        {
            console.log('Received message:', message); // Log the received message
            // Append the new message to the existing list of messages
            setMessages(prevMessages => [...prevMessages, message]);
        });

        return () => {
            // Clean up event listeners
            socket.disconnect();
        };
    }, []); // Run only on component mount

    const sendMessage = () => {
        if (inputMessage.trim() !== '') {
            // Send the message to the server
            socket.emit('message', {
                content: inputMessage,
                pname: 'receiver', // Replace with actual receiver's name
                sname: 'sender' // Replace with actual sender's name
            });
            setInputMessage(''); // Clear the input field after sending the message
        }
    };

    return (
        <div className={"testSocket"}>
            {/* Chat UI */}
            <div>
                {messages.map((message, index) => (
                    <div key={index}>{message}</div>
                ))}
            </div>
            <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default ChatComponent;
