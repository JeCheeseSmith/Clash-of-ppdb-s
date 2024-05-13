import * as API from "../../api/EndPoints/EndPoints.jsx";

/*
* made helper Functions for later use
* */

export const updateTimers = (username, setTimers) =>
{
    API.update(username).then(data => {setTimers(data)});
};

export const updateResources = (sid, setResources) =>
{
    API.get_resources(sid).then(data => {setResources(data);});
};

export const updateMap = (username, setSettlements) =>
{
    API.getMap(username).then(data => {setSettlements(data)})
}
