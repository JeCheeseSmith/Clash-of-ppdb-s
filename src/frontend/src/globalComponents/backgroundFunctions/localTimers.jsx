import {useEffect, useState} from 'react'; // Importing React library
import {useLocation} from "react-router-dom";
import {updateResources, updateTimers, updateMap} from "./updateFunctions.jsx";
import PlaySound from "../audioComponent/audio.jsx";

/**
 * Represents a component for managing local timers.
 * @param {object} props - The props object.
 * @param {Function} props.setResources - A function to set the resources.
 * @param {Array} props.timers - An array containing timer objects.
 * @param {Function} props.setTimers - A function to set the timers.
 * @param {Function} props.setSettlements - A function to set the settlements.
 * @param {Function} props.setFlag - A function to set the flag.
 * @param {boolean} props.callForUpdate - A boolean indicating if an update is requested.
 * @param {Function} props.setCallForUpdate - A function to set the update request.
 * @param {boolean} props.instantCallForUpdate - A boolean indicating if an instant update is requested.
 * @param {Function} props.setInstantCallForUpdate - A function to set the instant update request.
 * @returns {null} Null component.
 */
function LocalTimers(
    {
        setResources,
        timers,
        setTimers,
        setSettlements,
        setFlag,
        callForUpdate,
        setCallForUpdate,
        instantCallForUpdate,
        setInstantCallForUpdate,
        refresh,
        setRefresh
    })
{
    const { sid, username } = useLocation().state
    const location = useLocation();
    const [updateTime, setUpdateTime] = useState(null)
    const [helpTimers, setHelpTimers] = useState(null)
    const timeout = 30000
    const update = () =>
    {
        updateResources(sid, setResources)
        updateTimers(username, setTimers)
        if (location.pathname === "/Map")
        {
            updateMap(username, setSettlements)
            updateTimers(username, setHelpTimers)
        }
    }
    useEffect(() => // Changing Refreshing Button
    {
        if (!refresh)
        {
            const timer = setTimeout(() =>
            {
                setRefresh(true);
            }, timeout);
            return () => clearTimeout(timer);
        }
    }, [refresh]);
    useEffect(() => // Updating With Timeout
    {
        if (callForUpdate)
        {
            const currentTime = Date.now();
            if (updateTime === null)
            {
                update()
                setUpdateTime(Date.now())
            }
            else if (currentTime - updateTime >= timeout)
            {
                update()
                setUpdateTime(Date.now())
            }
            setCallForUpdate(false);
        }
    }, [callForUpdate, updateTime]);
    useEffect(() => // Updating Without Timeout
    {
        if (instantCallForUpdate)
        {
            update();
            setInstantCallForUpdate(false);
        }
    }, [instantCallForUpdate]);
    useEffect(() => // Updating Game Essentials After Each 15 Minutes
    {
        update() // do this twice, because without the first time, resources are going to be 0
        const intervalId = setInterval(() =>
        {
            update()
        }, 15 * 60 * 1000);
        return () => clearInterval(intervalId);
    }, []);
    useEffect(() => // Live Updating All Timers Locally
    {
        if (timers.length > 0)
        {
            const timerInterval = setInterval(() =>
            {
                const updatedTimers = [];
                for (let i = 0; i < timers.length; i++)
                {
                    let timer
                    if (location.pathname === "/Map")
                    {
                        timer = helpTimers[i];
                    }
                    else
                    {
                        timer = timers[i];
                    }
                    if (timer.duration > 0)
                    {
                        if (timer.duration === timer.totalDuration)
                        {
                            updateResources(sid, setResources)
                        }
                        updatedTimers.push({ ...timer, duration: timer.duration - 1 });
                    }
                    else
                    {
                        if (timer.type === "building")
                        {
                            let promise  = PlaySound("BuildingUpgraded")
                            if (location.pathname === "/MainPage")
                            {
                                setFlag(true)
                            }
                        }
                        update()
                        break
                    }
                }
                if (location.pathname === "/Map")
                {
                    setHelpTimers(updatedTimers);
                }
                else
                {
                    setTimers(updatedTimers);
                }
            }, 1000); // Decrease duration every second
            return () => clearInterval(timerInterval); // Clean up interval on component unmount
        }
    }, [timers, helpTimers]);
    return null
}
export default LocalTimers; // Exporting the MainPage component