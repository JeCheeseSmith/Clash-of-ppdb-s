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
import GrainSiloIMAGE from "./BuildMenu/assets/ObjectsImages/grainsilo.png";
import StoneStockpileIMAGE from "./BuildMenu/assets/ObjectsImages/stonestockpile.png";
import ArmoryIMAGE from "./BuildMenu/assets/ObjectsImages/armory.png";
import WoodStockpileIMAGE from "./BuildMenu/assets/ObjectsImages/woodstockpile.png";
import CastleIMAGE from "./BuildMenu/assets/ObjectsImages/castle.png";
import ChanceryIMAGE from "./BuildMenu/assets/ObjectsImages/chancery.png";
import BarracksIMAGE from "./BuildMenu/assets/ObjectsImages/barracks.png";
////////////////////////////////////////// BUILDING 3D OBJECTS //////////////////////////////////////////
import WoodCuttersCamp from "./GridView/models/Objects/Buildings/WoodCuttersCamp.jsx";
import Quarry from "./GridView/models/Objects/Buildings/Quarry.jsx";
import SteelMine from "./GridView/models/Objects/Buildings/SteelMine.jsx";
import Farm from "./GridView/models/Objects/Buildings/Farm.jsx";
import Stables from "./GridView/models/Objects/Buildings/Stables.jsx";
import ArcherTower from "./GridView/models/Objects/Buildings/ArcherTower.jsx";
import LookoutTower from "./GridView/models/Objects/Buildings/LookoutTower.jsx";
import BlackSmith from "./GridView/models/Objects/Buildings/BlackSmith.jsx";
import Tavern from "./GridView/models/Objects/Buildings/Tavern.jsx";
import GrainSilo from "./GridView/models/Objects/Buildings/GrainSilo.jsx";
import StoneStockpile from "./GridView/models/Objects/Buildings/StoneStockpile.jsx";
import Armory from "./GridView/models/Objects/Buildings/Armory.jsx";
import WoodStockpile from "./GridView/models/Objects/Buildings/WoodStockpile.jsx";
import Castle from "./GridView/models/Objects/Buildings/Castle.jsx";
import Chancery from "./GridView/models/Objects/Buildings/Chancery.jsx";
import Barracks from "./GridView/models/Objects/Buildings/Barracks.jsx";
import Gazebo from "./GridView/models/Objects/Buildings/Gazebo.jsx";
import Tree from "./GridView/models/Objects/Buildings/Tree.jsx";
import SnakeStatue from "./GridView/models/Objects/Buildings/SnakeStatue.jsx";
import Fountain from "./GridView/models/Objects/Buildings/Fountain.jsx";


/*
* Building Name: String
* Building Resolution: [columns, rows]
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
        "StoneStockPile": [StoneStockpileIMAGE, StoneStockpile, [6,6]],
        "Armory": [ArmoryIMAGE, Armory, [6,4]],
        "WoodStockPile": [WoodStockpileIMAGE, WoodStockpile, [4,3]]
    },

    Governmental:
    {
        "Castle": [CastleIMAGE, Castle, [13,13]],
        "Chancery": [ChanceryIMAGE, Chancery, [8,7]]
    },

    Military:
    {
        "Barracks": [BarracksIMAGE, Barracks, [5,6]]
    },

    Decoration:
    {
        "SnakeStatue": [BarracksIMAGE, SnakeStatue, [5,6]],
        "Fountain": [BarracksIMAGE, Fountain, [5,6]],
        "Tree": [BarracksIMAGE, Tree, [9,4]],
        "Gazebo": [BarracksIMAGE, Gazebo, [4,4]]
    }
};

export default Buildings;
