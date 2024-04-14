import * as API from "../../api/EndPoints/EndPoints.jsx";
export const updateTimers = (username, setTimers) =>
{
    API.update(username).then(data => {setTimers(data)});
};

export const getTimer = (ID, type, timers) =>
{
    if (type === "building")
    {
        let duration = [false, 0, 0]
        for (let timer of timers)
        {
            if (timer.ID[0] === ID[0] && timer.ID[1] === ID[1])
            {
                return [true, timer.duration, timer.totalDuration]
            }
        }
        return duration
    }
}

export const updateResources = (sid, setResources) =>
{
    API.get_resources(sid).then(data =>
    {
        setResources(data);
        console.log("Resource Updated: ", data, " at ",`${new Date().getHours()}h${new Date().getMinutes()}`);
    });
};
