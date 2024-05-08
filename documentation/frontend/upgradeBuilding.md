# UpgradeBuilding Component

The `UpgradeBuilding` component manages the upgrade process of a building. It displays the name of the selected building and renders an "Upgrade" button if the building is not currently being upgraded. If the building is being upgraded, it shows a progress bar indicating the upgrade progress. The component handles upgrade requests and updates resource and timer information accordingly. It also displays error messages in a popup if an upgrade request fails.

## Functionality

- Displays selected building name.
- Renders "Upgrade" button if not currently upgrading.
- Shows progress bar during upgrade.
- Handles upgrade requests and updates information.
- Displays error messages in a popup if request fails.

## Dependencies

- React
- React Router DOM
- TimerProgressBar Component
- DisplayAvatarName Component
- RequestMessagePopUp Component
- API
- PlaySound Function

## Props

- selectedBuilding: Array containing info about selected building.
- updateResources: Function to update available resources.
- updateTimers: Function to update timer information.
- getTimer: Function to retrieve timer information.
- oldPosition: Position of building before upgrade.

## State

- click: Indicates if "Upgrade" button clicked.
- errormessage: Stores error messages.
- popup: Controls visibility of error message popup.
- currentTimeValue: Current time value of upgrade timer.
- currentTotalDuration: Total duration of upgrade timer.
