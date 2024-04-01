import GET from "../GET.jsx";
import POST from "../POST.jsx";


export const getGrid = async (sid) =>
{
    const data = await GET({"sid":sid}, "/getGrid")
    return(data.grid)
}
export const get_resources = async (sid) =>
{
    const data = await POST({"id": sid}, '/resources');
    return(
        {
          wood: data.wood,
          stone: data.stone,
          steel: data.steel,
          food: data.food
        });
}

export const update_groupchat = async (username, receiver, message, API_Request) =>
{
    let data;
    if (API_Request === "GET")
    {
        data = await GET({"pname":username, "cname":receiver}, "/groupchat")
    }
    else if (API_Request === "POST")
    {
        await POST({"content": message, "sname": username, "pname":receiver}, "/chat")
    }
    return data
}

export const update_chat = async (username, receiver, message, API_Request) =>
{
    let data;
    if (API_Request === "GET")
    {
        data = await GET({"pname":username, "sname":receiver}, "/chat")
    }
    else if (API_Request === "POST")
    {
        data = await POST({"content": message, "pname": username, "cname":receiver}, "/groupchat")
    }
    return data
}