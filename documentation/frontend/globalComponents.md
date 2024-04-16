# PlaySound Function

The `PlaySound` function is a utility function used for playing different audio sounds based on the specified type.

## Usage

```javascript
import PlaySound from './path/to/PlaySound';

// Play resources error sound
PlaySound('ResourcesError');

// Play object placement error sound
PlaySound('ObjectPlacementError');

// Play social button sound
PlaySound('SocialButton');

// Play social option button sound
PlaySound('SocialOptionButton');

// Play building upgraded sound
PlaySound('BuildingUpgraded');

```

# DisplayAvatarName Component

The `DisplayAvatarName` component is used to display avatars and names based on different types.

## Props

- `type` (string): The type of display.
- `name` (string): The name to be displayed.
- `pname` (string, optional): The clan leader's name (required only when `type` is 'clan-search').
- `succesClanSearch` (boolean, optional): Flag indicating success of clan search (required only when `type` is 'clan-search').

## Sub-components

### PlayerRequest

Component to display avatar and name for player request.

### PlayerSearch

Component to display avatar and name for player search.

### ClanSearch

Component to display avatar and name for clan search.

### ChatPerson

Component to display avatar and name for chat person.

### ChatGroup

Component to display avatar and name for chat group.

### SelectedBuilding

Component to display avatar and name for selected building.

## Usage

```javascript
import DisplayAvatarName from './path/to/DisplayAvatarName';

// Example usage
<DisplayAvatarName type="player-request" name="John Doe" />

// More examples depending on the required type


```

# LocalTimers Component

The `LocalTimers` component manages local timers for resource updates and other actions.

## Props

- `setResources` (Function): A function to set the resources.
- `timers` (Array): An array containing timer objects.
- `setTimers` (Function): A function to set the timers.

## Functionality

- **Resource Update**: The component updates the resources and timers periodically.
- **Timer Management**: It manages timers for various actions and updates them accordingly.

## Dependencies

- `useEffect` from React library: Used to perform side effects in function components.
- `useLocation` from "react-router-dom": Used to access location information.
- `updateResources` and `updateTimers` from "./helperFunctions.jsx": Functions to update resources and timers.

## Usage

```javascript
import LocalTimers from './path/to/LocalTimers';

// Example usage
<LocalTimers setResources={setResources} timers={timers} setTimers={setTimers} />
```
# Request Massage PopUp Component

The `RequestMassagePopUp` component is used to display a popup message.

## Props

- `message` (string): The message to be displayed.
- `setPopup` (function): A function to set the popup state.

## Functionality

- **Display Message**: It displays the provided message in a popup.
- **Close Button**: It provides a button to close the popup when clicked.

## Dependencies

- `closePopUp.png` from "../../assets": Image used for the close button.

## Usage

```javascript
import RequestMassagePopUp from './path/to/RequestMassagePopUp';

// Example usage
<RequestMassagePopUp message={message} setPopup={setPopup} />
```

