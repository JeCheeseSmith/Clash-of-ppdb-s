# SocialBox Component

## Overview
This component represents a social box that contains various social options. It allows users to interact with different social features such as creating clans, joining clans, viewing general requests, and searching for other users.

## Props

This component does not receive any props directly. However, it relies on props passed to its child components.

## Functions

### toggleSocialVisibility
- **Description**: Toggles the visibility of the social box.
- **Parameters**: None
- **Return**: None

## Example Usage

```jsx
import React from 'react';
import SocialBox from './SocialBox';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Social App</h1>
        <SocialBox />
      </header>
    </div>
  );
}

export default App;
````

# SocialOption Component

## Overview
This component represents a set of social options based on the selected page. It includes functionalities such as creating clans, joining clans, viewing general requests, and searching for other users.

## Props

- `pageName` (string): The name of the page ('createClan', 'joinClan', 'requests', 'searchPerson').
- `requests` (Array): Array of requests data (only required for 'requests' page).
- `sendData` (Function): Function to send data (only required for 'requests' page).

## Example Usage

```jsx
import React from 'react';
import SocialOption from './SocialOption';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Social App</h1>
        <SocialOption pageName="createClan" />
      </header>
    </div>
  );
}

export default App;
