import GET from "../GET.jsx";
import POST from "../POST.jsx";


export const getGrid = async (sid) =>
{
    return await GET({"sid":sid}, "/getGrid")
}
export const get_resources = async (sid) =>
{
    return await POST({"id": sid}, '/resources');
}

export const upgradeBuilding = async (position, sid) =>
{
    return await POST({"position":position, "sid":sid}, '/upgradeBuilding');
}

export const update = async (sid) =>
{
    return await GET({"sid":sid}, '/update')
}

export const getMap = async () =>
{
    return await GET({}, '/map')
}

export const getTransfers = async () =>
{
    return await GET({}, '/getTransfers')
}

export const update_groupchat = async (username, receiver, message, API_Request) =>
{
    if (API_Request === "GET")
    {
        return await GET({"pname":username, "cname":receiver}, "/groupchat")
    }
    else if (API_Request === "POST")
    {
        return await POST({"content": message, "sname": username, "pname":receiver}, "/chat")
    }
}

export const update_chat = async (username, receiver, message, API_Request) =>
{
    if (API_Request === "GET")
    {
        return await GET({"pname":username, "sname":receiver}, "/chat")
    }
    else if (API_Request === "POST")
    {
        return await POST({"content": message, "pname": username, "cname":receiver}, "/groupchat")
    }
}