////////////////////////////////////////// SOLDIER IMAGES //////////////////////////////////////////
import ArmoredFootman from "../assets/images/swordman.png"
import Huskarl from "../assets/images/knight.png";
import OrderKnight from "../assets/images/templar.png";
import Horseman from "../assets/images/Horseman.png"
import Knight from "../assets/images/HorseKnight.png"
import WarElephant from "../assets/images/War elephant.png"
import Bowman from "../assets/images/bowman.png"
import LongbowMan from "../assets/images/Longbowman.png"
import CrossbowMan from "../assets/images/Crossbowman.png"
import Bandit from "../assets/images/bandit.png"
import Militia from "../assets/images/militia.png"
import Skirmisher from "../assets/images/assassin.png"
import Guardsman from "../assets/images/guardian.png"
import Pikeman from "../assets/images/Pikeman.png"
import Halbardier from "../assets/images/Halbardier.png"

/*
* Dictionary consisting soldier images with their name
* */

const Soldiers =
{
    "heavyInfantry": {ArmoredFootman:ArmoredFootman, Huskarl:Huskarl, OrderKnight:OrderKnight},

    "horseman": {Horseman:Horseman, Knight:Knight, WarElephant:WarElephant},

    "bowman": {Bowman:Bowman, LongbowMan:LongbowMan, CrossbowMan:CrossbowMan},

    "ambush": {Bandit:Bandit, Militia:Militia, Skirmisher:Skirmisher},

    "spear": {Guardsman:Guardsman, Pikeman:Pikeman, Halbardier:Halbardier}
};

export default Soldiers;
