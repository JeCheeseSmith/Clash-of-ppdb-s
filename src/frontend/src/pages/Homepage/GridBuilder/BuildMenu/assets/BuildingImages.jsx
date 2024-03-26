import WoodCuttersCamp from "./ObjectsImages/WoodCuttersCamp.png";
import Quarry from "./ObjectsImages/quarry.png";
import SteelMine from "./ObjectsImages/steelmine.png";
import Farm from "./ObjectsImages/farm.png";
import Stables from "./ObjectsImages/stable.png";
import ArcherTower from "./ObjectsImages/archertower.png";
import LookoutTower from "./ObjectsImages/lookouttower.png";
import BlackSmith from "./ObjectsImages/blacksmith.png";
import Tavern from "./ObjectsImages/tavern.png";
import TrainingYard from "./ObjectsImages/trainingyard.png";
import GrainSilo from "./ObjectsImages/grainsilo.png";
import StoneStockpile from "./ObjectsImages/stonestockpile.png";
import Armory from "./ObjectsImages/armory.png";
import WoodStockpile from "./ObjectsImages/woodstockpile.png";
import Castle from "./ObjectsImages/castle.png";
import Chancery from "./ObjectsImages/chancery.png";
import Barracks from "./ObjectsImages/barracks.png";

const BuildingImages =
{
    Production:
    {
        WoodCuttersCamp: [WoodCuttersCamp, [6, 6]],
        Quarry: [Quarry, [5, 5]],
        SteelMine: [SteelMine, [8, 5]],
        Farm: [Farm, [5, 5]]
    },

    Defense: {
        Stables: [Stables, [8,8]],
        ArcherTower: [ArcherTower, [3,3]],
        LookoutTower: [LookoutTower, [3,3]],
        BlackSmith: [BlackSmith, [6,6]],
        Tavern: [Tavern, [10,10]],
        TrainingYard: [TrainingYard, [4,4]]
    },
    Storage: {
        GrainSilo: [GrainSilo, [3,3]],
        StoneStockpile: [StoneStockpile, [8,8]],
        Armory: [Armory, [6,5]],
        WoodStockpile: [WoodStockpile, [4,4]]
    },
    Governmental: {
        Castle: [Castle, [15,15]],
        Chancery: [Chancery, [10,10]]
    },
    Military: {
        Barracks: [Barracks, [8,8]]
    }
};

export default BuildingImages;
