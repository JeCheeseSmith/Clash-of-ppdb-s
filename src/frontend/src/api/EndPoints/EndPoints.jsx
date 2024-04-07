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

export const get_unlockedTroops = async (sid) =>
{
    const data = await GET( {"id": sid}, '/unlockedTroops');
    return (
        {
            heavyInfantry1: data.ArmoredFootman,
            heavyInfantry2: data.Huskarl,
            heavyInfantry3: data.OrderKnight,
            spear1: data.Guardsman,
            spear2: data.Pikeman,
            spear3: data.Halbardier,
            horseman1: data.Horseman,
            horseman2: data.Knight,
            horseman3: data.WarElephant,
            bowman1: data.Bowman,
            bowman2: data.LongbowMan,
            bowman3: data.CrossbowMan,
            ambush1: data.Bandit,
            ambush2: data.Militia,
            ambush3: data.Skirmisher
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