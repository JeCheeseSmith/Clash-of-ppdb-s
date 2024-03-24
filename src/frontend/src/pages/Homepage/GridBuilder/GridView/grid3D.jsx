import React, {Suspense, useRef, useState} from 'react';
import {Canvas, useFrame} from '@react-three/fiber';
import {Float, OrbitControls} from '@react-three/drei';
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
import Chancery from "./models/Chancery.jsx";
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
    Chancery,
    // Military //
    Barracks
};

/**
 * A 3D grid component with interactive cells and objects.
 * @component
 * @param {Object[]} buildings - Array of buildings.
 * @param {number[]} position - Position of the building.
 * @param {Function} setPosition - Function to set the position of the building.
 * @return {JSX.Element} A React JSX Element representing the 3D grid.
 */

function Grid({buildings, position, setPosition})
{
    const [floating, setFloating] = useState(false)
    const gridSize = 40;
    // State variable to hold the coordinates of the house
    const handleCellClick = (rowIndex, colIndex) =>
    {
        for (let building of buildings)
        {
            if (building.position === position)
            {
                setPosition()
                building.position = [rowIndex,colIndex]
            }
        }
    };

    const handleObjectClick = (building) =>
    {
        setFloating(!floating)
    }

    const BuildingMesh = ({building, position}) =>
    {
        const meshRef = useRef(); // Define the useRef hook here
        useFrame(() =>
        {
            // This function will be called on every frame update
            if (floating)
            {
                meshRef.current.position.y = Math.sin(Date.now() * 0.002) + 7; // Adjust the amplitude and speed as needed
            }
        });
        const centerX = position[0] + 0.5;
        const centerY = position[1] + 0.5;
        const Building = BuildingComponents[building.type];
        return (
            <mesh ref={meshRef} position={[centerX - gridSize / 2, 6, centerY - gridSize / 2 + 0.5]} onClick={() => handleObjectClick(building)}>
                <Building />
            </mesh>
        );
    };


    const renderCell = (rowIndex, colIndex) =>
    {
        let buildingFound = false;
        for (let building of buildings)
        {
            if (rowIndex === building.position[0] && colIndex === building.position[1]) {
                // Calculate the center position of the cell
                buildingFound = true;
                return (
                    <BuildingMesh position={[rowIndex,colIndex]} key={`${rowIndex}-${colIndex}`} building={building} />
                );
            }
        }
        if (!buildingFound) {
            return (
                <gridHelper
                    key={`${rowIndex}-${colIndex}`}
                    position={[colIndex - gridSize / 2, 6, rowIndex - gridSize / 2]}
                    args={[1, 1]}
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
