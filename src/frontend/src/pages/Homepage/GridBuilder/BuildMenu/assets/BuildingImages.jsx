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
    Production: {
        WoodCuttersCamp: WoodCuttersCamp,
        Quarry: Quarry,
        SteelMine: SteelMine,
        Farm: Farm
    },
    Defense: {
        Stables: Stables,
        ArcherTower: ArcherTower,
        LookoutTower: LookoutTower,
        BlackSmith: BlackSmith,
        Tavern: Tavern,
        TrainingYard: TrainingYard
    },
    Storage: {
        GrainSilo: GrainSilo,
        StoneStockpile: StoneStockpile,
        Armory: Armory,
        WoodStockpile: WoodStockpile
    },
    Governmental: {
        Castle: Castle,
        Chancery: Chancery
    },
    Military: {
        Barracks: Barracks
    }
};

export default BuildingImages;
