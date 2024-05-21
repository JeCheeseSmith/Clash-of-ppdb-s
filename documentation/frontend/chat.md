# ChatBox Component

## Overview
This component represents a chat box with message display and input functionality. Users can exchange messages in a chat interface.

## Props

This component does not receive any props directly. However, it relies on props passed to its child components `MessageDisplay` and `MessageInput`.

## Functions

### handleMessageSubmit
- **Description**: Adds a new message to the chat.
- **Parameters**: `content` (string) - The content of the message, `sender` (string) - The sender of the message.
- **Return**: None

### toggleChatVisibility
- **Description**: Toggles the visibility of the chat box.
- **Parameters**: None
- **Return**: None

## Dependencies

- React
- react-router-dom
- ./chat.css
- POST.jsx (custom API module)

## Example Usage

```jsx
import React from 'react';
import ChatBox from './ChatBox';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Chat Application</h1>
        <ChatBox />
      </header>
    </div>
  );
}

export default App;
````

# ChatIcons Component

## Overview
This component renders a list of chat contacts with icons representing each contact. It also handles message retrieval and updates based on the selected contact.

## Props

- `contactList` (Object): The list of contacts to display.
- `messages` (Array): The array of messages exchanged in the chat.
- `updateMessages` (Function): Function to update the messages in the chat.
- `receiver` (String): The current receiver of messages in the chat.
- `updateReceiver` (Function): Function to update the receiver of messages.
- `updateTypeReceiver` (Function): Function to update the type of receiver (person or group).
- `chatVisible` (Boolean): Flag indicating whether the chat interface is visible.
- `setNewReport` (Function): Function to set a flag for new report notifications.

## Functions

### messagesAreEqual
- **Description**: Compares two arrays of messages to check if they are equal.
- **Parameters**: `oldMessages` (Array), `newMessages` (Array)
- **Return**: Boolean indicating whether the messages are equal.

### update
- **Description**: Updates the messages based on the received data and selected contact.
- **Parameters**: `data` (Array), `name` (String), `type` (String)
- **Return**: None

### retrieveMessages
- **Description**: Retrieves messages from the server based on the selected contact.
- **Parameters**: `name` (String), `type` (String)
- **Return**: None

### updateAdminMessages
- **Description**: Updates the admin messages and checks for new reports.
- **Parameters**: None
- **Return**: None

## Dependencies

- React
- ./chatIcons.css
- AvatarWithName component (global component)
- GET.jsx (custom API module)
- PlaySound component (global component)

## Example Usage

```jsx
import React, { useEffect, useState } from 'react';
import ChatIcons from './ChatIcons';

function ChatApp() {
  const [contactList, setContactList] = useState({});
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState('');
  const [typeReceiver, setTypeReceiver] = useState('');
  const [chatVisible, setChatVisible] = useState(false);
  const [newReport, setNewReport] = useState(false);

  return (
    <div className="ChatApp">
      <ChatIcons
        contactList={contactList}
        messages={messages}
        updateMessages={setMessages}
        receiver={receiver}
        updateReceiver={setReceiver}
        updateTypeReceiver={setTypeReceiver}
        chatVisible={chatVisible}
        setNewReport={setNewReport}
      />
    </div>
  );
}

export default ChatApp;
