# LocalTimers Component

## Overview

The `LocalTimers` component is a React component designed to manage and update local timers within an application. This component leverages several React hooks and other utility functions to ensure the timely update of resources, timers, and settlements.

## Dependencies

This component depends on the following libraries and modules:
- `react`
- `react-router-dom`
- `./updateFunctions.jsx`
- `../audioComponent/audio.jsx`

## Props

The `LocalTimers` component accepts the following props:

| Prop Name                | Type       | Description                                                      |
|--------------------------|------------|------------------------------------------------------------------|
| `setResources`           | Function   | Function to set the resources state.                             |
| `timers`                 | Array      | Array of timer objects.                                          |
| `setTimers`              | Function   | Function to set the timers state.                                |
| `setSettlements`         | Function   | Function to set the settlements state.                           |
| `setFlag`                | Function   | Function to set a flag state.                                    |
| `callForUpdate`          | boolean    | Boolean indicating if an update is requested.                    |
| `setCallForUpdate`       | Function   | Function to set the update request state.                        |
| `instantCallForUpdate`   | boolean    | Boolean indicating if an instant update is requested.            |
| `setInstantCallForUpdate`| Function   | Function to set the instant update request state.                |
| `refresh`                | boolean    | Boolean indicating if a refresh is requested.                    |
| `setRefresh`             | Function   | Function to set the refresh state.                               |

## Functionality

### useLocation

The `useLocation` hook is used to access the current location object, which contains the `sid` and `username` properties from the state.

### useState

The `useState` hook is used to manage local state for `updateTime`.

### useEffect

Several `useEffect` hooks are utilized to handle different aspects of the component's lifecycle:

1. **Changing Refreshing Button**:
    - This effect sets a timeout to change the `refresh` state to `true` after a specified `timeout` (30 seconds).

    ```javascript
    useEffect(() => {
        if (!refresh) {
            const timer = setTimeout(() => {
                setRefresh(true);
            }, timeout);
            return () => clearTimeout(timer);
        }
    }, [refresh]);
    ```

2. **Updating With Timeout**:
    - This effect triggers the `update` function if `callForUpdate` is `true` and manages the timing for updates based on `updateTime`.

    ```javascript
    useEffect(() => {
        if (callForUpdate) {
            const currentTime = Date.now();
            if (updateTime === null) {
                update();
                setUpdateTime(Date.now());
            } else if (currentTime - updateTime >= timeout) {
                update();
                setUpdateTime(Date.now());
            }
            setCallForUpdate(false);
        }
    }, [callForUpdate, updateTime]);
    ```

3. **Updating Without Timeout**:
    - This effect immediately triggers the `update` function if `instantCallForUpdate` is `true`.

    ```javascript
    useEffect(() => {
        if (instantCallForUpdate) {
            update();
            setInstantCallForUpdate(false);
        }
    }, [instantCallForUpdate]);
    ```

4. **Updating Game Essentials After Each 15 Minutes**:
    - This effect sets up an interval to call the `update` function every 15 minutes.

    ```javascript
    useEffect(() => {
        update(); // Initial update
        const intervalId = setInterval(() => {
            update();
        }, 15 * 60 * 1000);
        return () => clearInterval(intervalId);
    }, []);
    ```

5. **Live Updating All Timers Locally**:
    - This effect sets up an interval to update local timers every second and performs specific actions when timers reach zero duration.

    ```javascript
    useEffect(() => {
        if (timers.length > 0) {
            const timerInterval = setInterval(() => {
                const updatedTimers = timers.map(timer => {
                    if (timer.duration > 0) {
                        if (timer.duration === timer.totalDuration) {
                            updateResources(sid, setResources);
                        }
                        return { ...timer, duration: timer.duration - 1 };
                    } else {
                        if (timer.type === "building") {
                            PlaySound("BuildingUpgraded").then(() => {
                                if (location.pathname === "/MainPage") {
                                    setFlag(true);
                                }
                            });
                        }
                        update();
                        return timer;
                    }
                }).filter(timer => timer.duration > 0);
                setTimers(updatedTimers);
            }, 1000); // Decrease duration every second
            return () => clearInterval(timerInterval); // Clean up interval on component unmount
        }
    }, [timers]);
    ```

### update Function

The `update` function calls `updateResources`, `updateTimers`, and `updateMap` based on the current state and location.

```javascript
const update = () => {
    updateResources(sid, setResources);
    updateTimers(username, setTimers);
    if (location.pathname === "/Map") {
        updateMap(username, setSettlements);
    }
};
