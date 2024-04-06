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

export const get_SoldiersAvailable = async (sid) =>
{
    const data = await GET( {"id": sid}, '/unlockedTroops');
    return (
        {
            heavyInfantry1: data.heavyInfantry1,
            heavyInfantry2: data.heavyInfantry2,
            heavyInfantry3: data.heavyInfantry3,
            spear1: data.spear1,
            spear2: data.spear2,
            spear3: data.spear3,
            horseman1: data.horseman1,
            horseman2: data.horseman2,
            horseman3: data.horseman3,
            bowman1: data.bowman1,
            bowman2: data.bowman2,
            bowman3: data.bowman3,
            ambush1: data.ambush1,
            ambush2: data.ambush2,
            ambush3: data.ambush3
    });
}


export const upgradeBuilding = async (position, sid) =>
{
    return await POST({"position":position, "sid":sid}, '/upgradeBuilding');
}

export const update = async (sid) =>
{
    return await GET({"sid":sid}, '/update')
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