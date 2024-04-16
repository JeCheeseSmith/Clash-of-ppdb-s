import GET from "../GET.jsx";
import POST from "../POST.jsx";
import {empty} from "leaflet/src/dom/DomUtil.js";


export const getGrid = async (sid) =>
{
    return await GET({"sid":sid}, "/getGrid")
}
export const get_resources = async (sid) =>
{
    return await POST({"id": sid}, '/resources');
}

export const get_unlockedTroops = async (sid) =>
{
    return await GET( {"id": sid}, '/unlockedTroops');
}

export const get_getTroops = async (sid) =>
{
    return await GET( {"id": sid}, '/getTroops');
}

export const get_getConsumption = async (sid) =>
{
    return await GET( {"id": sid}, '/getConsumption')
}

export const trainTroop = async (sid, soldierName, amount) =>
{
    return await POST( {"id": sid, "sname": soldierName, "amount": amount}, '/trainTroop')
}


export const upgradeBuilding = async (position, sid) =>
{
    return await POST({"position":position, "sid":sid}, '/upgradeBuilding');
}

export const update = async (username) =>
{
    return await GET({"pname":username}, '/update')
}

export const getMap = async () =>
{
    return await GET({}, '/map')
}

export const transfer = async (idTo, toType, idFrom, soldiers, resources, tType, pname) =>
{
    return await POST({idTo, toType, idFrom, soldiers, resources, tType, pname}, '/transfer')
}

export const espionage = async (idTo, sidFrom, toType) =>
{
    return await POST({idTo, sidFrom, toType}, '/espionage')
}

export const getInfo = async (oid, pname, type) =>
{
    return await GET({"oid":oid, "pname":pname, "type":type}, '/getInfo')
}

export const createOutpost = async (coordTo, sidFrom, outpostName, soldiers, resources) =>
{
    return await POST({coordTo, sidFrom, outpostName, soldiers, resources}, '/createOutpost')
}