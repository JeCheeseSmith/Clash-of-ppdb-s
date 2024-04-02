////////////////////////////////////////// BUILDING IMAGES //////////////////////////////////////////
import WoodCuttersCampIMAGE from "./BuildMenu/assets/ObjectsImages/WoodCuttersCamp.png";
import QuarryIMAGE from "./BuildMenu/assets/ObjectsImages/quarry.png";
import SteelMineIMAGE from "./BuildMenu/assets/ObjectsImages/steelmine.png";
import FarmIMAGE from "./BuildMenu/assets/ObjectsImages/farm.png";
import StablesIMAGE from "./BuildMenu/assets/ObjectsImages/stable.png";
import ArcherTowerIMAGE from "./BuildMenu/assets/ObjectsImages/archertower.png";
import LookoutTowerIMAGE from "./BuildMenu/assets/ObjectsImages/lookouttower.png";
import BlackSmithIMAGE from "./BuildMenu/assets/ObjectsImages/blacksmith.png";
import TavernIMAGE from "./BuildMenu/assets/ObjectsImages/tavern.png";
import TrainingYardIMAGE from "./BuildMenu/assets/ObjectsImages/trainingyard.png";
import GrainSiloIMAGE from "./BuildMenu/assets/ObjectsImages/grainsilo.png";
import StoneStockpileIMAGE from "./BuildMenu/assets/ObjectsImages/stonestockpile.png";
import ArmoryIMAGE from "./BuildMenu/assets/ObjectsImages/armory.png";
import WoodStockpileIMAGE from "./BuildMenu/assets/ObjectsImages/woodstockpile.png";
import CastleIMAGE from "./BuildMenu/assets/ObjectsImages/castle.png";
import ChanceryIMAGE from "./BuildMenu/assets/ObjectsImages/chancery.png";
import BarracksIMAGE from "./BuildMenu/assets/ObjectsImages/barracks.png";
////////////////////////////////////////// BUILDING 3D OBJECTS //////////////////////////////////////////
import WoodCuttersCamp from "./GridView/models/Objects/WoodCuttersCamp.jsx";
import Quarry from "./GridView/models/Objects/Quarry.jsx";
import SteelMine from "./GridView/models/Objects/SteelMine.jsx";
import Farm from "./GridView/models/Objects/Farm.jsx";
import Stables from "./GridView/models/Objects/Stables.jsx";
import ArcherTower from "./GridView/models/Objects/ArcherTower.jsx";
import LookoutTower from "./GridView/models/Objects/LookoutTower.jsx";
import BlackSmith from "./GridView/models/Objects/BlackSmith.jsx";
import Tavern from "./GridView/models/Objects/Tavern.jsx";
import TrainingYard from "./GridView/models/Objects/TrainingYard.jsx";
import GrainSilo from "./GridView/models/Objects/GrainSilo.jsx";
import StoneStockpile from "./GridView/models/Objects/StoneStockpile.jsx";
import Armory from "./GridView/models/Objects/Armory.jsx";
import WoodStockpile from "./GridView/models/Objects/WoodStockpile.jsx";
import Castle from "./GridView/models/Objects/Castle.jsx";
import Chancery from "./GridView/models/Objects/Chancery.jsx";
import Barracks from "./GridView/models/Objects/Barracks.jsx";


/*
* Building Name: String
* Building Size: [columns, rows]
* */

const Buildings =
{
    Production:
    {
        "WoodCuttersCamp": [WoodCuttersCampIMAGE, WoodCuttersCamp, [7, 7]],
        "Quarry": [QuarryIMAGE, Quarry, [3, 3]],
        "SteelMine": [SteelMineIMAGE, SteelMine, [6, 3]],
        "Farm": [FarmIMAGE, Farm, [4, 4]]
    },

    Defense:
    {
        "Stables": [StablesIMAGE, Stables, [7,5]],
        "ArcherTower": [ArcherTowerIMAGE, ArcherTower, [3,3]],
        "LookoutTower": [LookoutTowerIMAGE, LookoutTower, [3,3]],
        "BlackSmith": [BlackSmithIMAGE, BlackSmith, [5,6]],
        "Tavern": [TavernIMAGE, Tavern, [8,8]]
    },

    Storage:
    {
        "GrainSilo": [GrainSiloIMAGE, GrainSilo, [3,3]],
        "StoneStockpile": [StoneStockpileIMAGE, StoneStockpile, [6,6]],
        "Armory": [ArmoryIMAGE, Armory, [6,4]],
        "WoodStockpile": [WoodStockpileIMAGE, WoodStockpile, [4,3]]
    },

    Governmental:
    {
        "Castle": [CastleIMAGE, Castle, [13,13]],
        "Chancery": [ChanceryIMAGE, Chancery, [8,7]]
    },

    Military:
    {
        "Barracks": [BarracksIMAGE, Barracks, [5,6]]
    }
};

export default Buildings;
