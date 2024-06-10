import GET from "./GET.jsx";
import POST from "./POST.jsx";


/*
 * async API Functions for better use
 * @typedef {Object} Sid - Session ID
 * @property {string} id - Session ID
 * @typedef {Object} SoldierName - Soldier's Name
 * @property {string} sname - Soldier's Name
 * @typedef {Object} Amount - Amount of soldiers
 * @property {number} amount - Amount of soldiers
 * @typedef {Object} Position - Building position
 * @property {string} position - Building position
 * @typedef {Object} Username - User's name
 * @property {string} pname - User's name
 * @typedef {Object} IdTo - ID of the target
 * @property {string} idTo - ID of the target
 * @typedef {Object} IdFrom - ID of the source
 * @property {string} idFrom - ID of the source
 * @typedef {Object} ToType - Type of the target
 * @property {string} toType - Type of the target
 * @typedef {Object} TType - Transfer type
 * @property {string} tType - Transfer type
 * @typedef {Object} OID - Object ID
 * @property {string} oid - Object ID
 * @typedef {Object} OutpostName - Name of the outpost
 * @property {string} outpostName - Name of the outpost
 * @typedef {Object} CoordTo - Coordinates of the target
 * @property {string} coordTo - Coordinates of the target
 * @typedef {Object} XPLevel - Experience and Level
 * @property {string} name - User's name
 * @typedef {Object} Pos - Building position
 * @property {string} position - Building position
 * @typedef {Object} Sid - Session ID
 * @property {string} sid - Session ID
 */


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
    return await GET( {"sid": sid}, '/unlockedTroops');
}

export const get_getTroops = async (sid) =>
{
    return await GET( {"id": sid, "type": "settlement"}, '/getTroops');
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

export const getMap = async (username) =>
{
    return await GET({'pname':username}, '/map')
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

export const getAchieved = async(pname) =>
{
    return await GET({"pname": pname}, "/getAchievements")
}

export const getXPLevel = async (username) => {
    return await GET({ name: username}, "/getXPandLevel");
}

export const Wheelcheck= async (username)=>{
    return await GET({name: username},"/controlespin")
}

export const getBuildingInfo= async (Pos,Sid)=>{
    return await GET({position:Pos,sid:Sid},"/getBuildingInfo")
}