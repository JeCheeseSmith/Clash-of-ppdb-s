import * as API from "../../api/EndPoints/EndPoints.jsx";

/*
* made helper Functions for later use
* */

export const updateTimers = (username, setTimers) =>
{
    API.update(username).then(data => {setTimers(data); console.log("Update Timers Called: ", data)});
};

export const updateResources = (sid, setResources) =>
{
    API.get_resources(sid).then(data =>
    {
        setResources(data);
        console.log("Resource Updated: ", data, " at ",`${new Date().getHours()}h${new Date().getMinutes()}`);
    });
};
