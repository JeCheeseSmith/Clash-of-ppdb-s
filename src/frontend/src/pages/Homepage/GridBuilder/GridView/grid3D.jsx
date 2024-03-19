import React, {Suspense, useEffect, useState} from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import './grid3D.css'
import WoodCuttersCamp from "./models/WoodCuttersCamp.jsx";
import Quarry from "./models/Quarry.jsx";
import SteelMine from "./models/SteelMine.jsx";
import Farm from "./models/Farm.jsx";
import Stables from "./models/Stables.jsx";
import ArcherTower from "./models/ArcherTower.jsx";
import LookoutTower from "./models/LookoutTower.jsx";
import BlackSmith from "./models/BlackSmith.jsx";
import Tavern from "./models/Tavern.jsx";
import TrainingYard from "./models/TrainingYard.jsx";
import GrainSilo from "./models/GrainSilo.jsx";
import StoneStockpile from "./models/StoneStockpile.jsx";
import Armory from "./models/Armory.jsx";
import WoodStockpile from "./models/WoodStockpile.jsx";
import Castle from "./models/Castle.jsx";
import Barracks from "./models/Barracks.jsx";

/**
 * A 3D grid component with interactive cells and objects.
 * @component
 * @return {JSX.Element} A React JSX Element representing the 3D grid.
 */

const BuildingComponents = {
    // Production //
    WoodCuttersCamp,
    Quarry,
    SteelMine,
    Farm,
    // Defence //
    Stables,
    ArcherTower,
    LookoutTower,
    BlackSmith,
    Tavern,
    TrainingYard,
    // Storage //
    GrainSilo,
    StoneStockpile,
    Armory,
    WoodStockpile,
    // Governmental //
    Castle,
    // Military //
    Barracks
};
function Grid({setClicked, clicked, type, position, buildings})
{
    const gridSize = 40;
    const Building = BuildingComponents[type]
    // State variable to hold the coordinates of the house
    // const [buildingPosition, setBuildingPosition] = useState({location:[4, 3]}); // Initial position
    // const handleCellClick = async (rowIndex, colIndex) =>
    // {
    //     setBuildingPosition({location: [rowIndex, colIndex]})
    // };

    // useEffect(() =>
    // {
    //     console.log("started")
    //     console.log(buildings)
    //     setClicked(false)
    //     console.log("finished")
    // }, [clicked]);

    const renderCell = (rowIndex, colIndex) =>
    {
        let buildingFound = false;
        for (let building of buildings)
        {
            if (rowIndex === building.position[0] && colIndex === building.position[1]) {
                // Calculate the center position of the cell
                const centerX = colIndex + 0.5;
                const centerY = rowIndex + 0.5;
                buildingFound = true;
                return (
                    <mesh position={[centerX - gridSize / 2, 6, centerY - gridSize / 2 + 0.5]}>
                        <Building />
                    </mesh>
                );
            }
        }
        if (!buildingFound)
        {
            return (
                <gridHelper
                    key={`${rowIndex}-${colIndex}`}
                    position={[colIndex - gridSize / 2, 6, rowIndex - gridSize / 2]}
                    args={[1, 1]}
                    // onClick={() => handleCellClick(rowIndex, colIndex)}
                />
            );
        }
    };


    return (
        <Suspense fallback={null}>
            <Canvas camera={{ position: [40, 35, 60] }} className={"grid"}>
                <directionalLight />
                <ambientLight />
                <pointLight />
                <spotLight />
                <hemisphereLight />
                <OrbitControls enableZoom={true} zoomSpeed={0.5} maxDistance={42} minDistance={0} />
                {
                    (() =>
                        {
                            const renderedCells = [];
                            for (let i = 0; i < gridSize; i++)
                            {
                                const renderedRow = [];
                                for (let j = 0; j < gridSize; j++)
                                {
                                    renderedRow.push(renderCell(i, j));
                                }
                                renderedCells.push(renderedRow);
                            }
                            return renderedCells;
                        }
                    )()
                }
            </Canvas>
        </Suspense>
    );
}

export default Grid;
