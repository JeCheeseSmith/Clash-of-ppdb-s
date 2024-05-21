# BuildMenu Component Documentation

## Overview
The BuildMenu component represents a button that toggles the visibility of a build menu. It allows users to select different options for building structures.

## Props

- `addBuilding` (Function): Function to add a building.
- `buildings` (Array): Array of existing buildings.
- `setCallForUpdate` (Function): Function to trigger an update.

## Functions

### toggleMenuVisibility
- **Description**: Toggles the visibility of the build menu.
- **Parameters**: None
- **Return**: None

## Example Usage

```jsx
import React from 'react';
import BuildMenu from './BuildMenu';

function App() {
  const buildings = []; // Array of existing buildings
  const addBuilding = (type, position, size, occupiedCells) => {
    // Function to add a building
  };
  const setCallForUpdate = () => {
    // Function to trigger an update
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Building App</h1>
        <BuildMenu addBuilding={addBuilding} buildings={buildings} setCallForUpdate={setCallForUpdate} />
      </header>
    </div>
  );
}

export default App;
````
# BuildmenuOptionsContents Component Documentation

## Overview
The BuildmenuOptionsContents component renders a set of building options based on the current page. It allows users to choose buildings to construct.

## Props

- `currentPage` (string): The name of the current page ('Production', 'Defense', 'Storage', 'Governmental', 'Military', 'Decoration').
- `addBuildable` (Function): Function to add a building.
- `buildings` (Array): Array of existing buildings.

## Example Usage

```jsx
import React from 'react';
import BuildmenuOptionsContents from './BuildmenuOptionsContents';

function App() {
  const buildings = []; // Array of existing buildings
  const addBuildable = (type, position, size, occupiedCells) => {
    // Function to add a building
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Building Options</h1>
        <BuildmenuOptionsContents currentPage="Production" addBuildable={addBuildable} buildings={buildings} />
      </header>
    </div>
  );
}

export default App;
````
