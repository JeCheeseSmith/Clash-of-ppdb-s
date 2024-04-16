# Map Component

The `Map` component is responsible for displaying and interacting with a map within a React application. It renders a 3D map using the `Canvas` component from `@react-three/fiber` and allows users to navigate and interact with the map environment.

## Props

- `setMenuVisible`: A function to set the visibility of the menu.
- `setSelectedObject`: A function to set the selected object on the map.
- `outpostChosen`: A boolean indicating if an outpost is chosen.
- `setOutpostChosen`: A function to set if an outpost is chosen.

## Functionality

- Displays a 3D map environment.
- Allows navigation and interaction with the map.
- Renders settlements and transfer arrows on the map based on data.
- Updates resources and timers.
- Handles click events on settlements and transfer arrows.

## Dependencies

- React
- React Router DOM
- @react-three/fiber
- @react-three/drei
- three.js
- API endpoints

## Subcomponents

- `Arrow`: Renders transfer arrows on the map.
- `Settlement1`: Renders settlement models on the map.
- `ResourceBar`: Displays resource information.
- `LocalTimers`: Manages local timers for resource updates.

# TransferMenu Component

The `TransferMenu` component represents a menu for displaying transfer options. It includes a navigation bar and a close button.

## Props

- `outpostChosen`: A boolean indicating if an outpost is chosen.
- `selectedObject`: The selected object.
- `setMenuVisible`: A function to set the visibility of the menu.

## Functionality

- Renders a navigation bar and a close button.
- Handles click events to switch between transfer options.

# TransferOption Component

The `TransferOption` component renders different transfer option pages based on the selected page name.

## Props

- `pageName`: The name of the page to be rendered.
- `selectedObject`: The selected object.
- `outpostChosen`: A boolean indicating if an outpost is chosen.

## Pages

- **Transfer**: Allows transferring soldiers and resources.
- **Attack**: Allows sending troops for an attack.
- **Espionage**: Allows initiating espionage.
- **Information**: Displays information about the selected object.


