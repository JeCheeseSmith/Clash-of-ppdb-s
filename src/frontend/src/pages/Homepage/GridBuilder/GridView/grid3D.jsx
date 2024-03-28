import React, {Suspense, useEffect, useRef, useState} from 'react';
import {Canvas, useFrame} from '@react-three/fiber';
import {OrbitControls} from '@react-three/drei';
import './grid3D.css'
import Buildings3D from "./models/Buildings3D.jsx";
import * as THREE from "three";
import Ground from "./models/Objects/Ground.jsx";
import GridCalculation from "../gridCalculation.jsx";
import error from "../../../../assets/buildingPlacementError.mp3";
import BuildingImages from "../BuildMenu/assets/BuildingImages.jsx";
import POST from "../../../../api/POST.jsx";

/**
 * A 3D grid component with interactive cells and objects.
 * @component
 * @param {Object[]} buildings - Array of buildings.
 * @param addBuildings
 * @return {JSX.Element} A React JSX Element representing the 3D grid.
 */

function Grid({buildings})
{
    const sid = localStorage.getItem('sid');
    const [selectedBuilding, setSelectedBuilding] =
        useState([[],false /*floating*/, 0x006f00 /*shadowColor*/, true /*validPosition for Mouse Right Click*/])

    const [oldPosition, setOldPosition] = useState([])

    const gridSize = 40;
    const checkTechnicalCollisions = (position) =>  // checkt de technische positie (de linksboven posities checken)
    {
        for (let building of buildings)
        {
            if (building.position[0] === position[0] && building.position[1] === position[1])
            {
                return true; // Collision detected
            }
        }
        return false; // No collision
    };
    const moveObject = (row, col) =>
    {
        const newPosition = [selectedBuilding[0].position[0] + row, selectedBuilding[0].position[1] + col];
        let occupiedCells = GridCalculation(buildings, selectedBuilding, newPosition)
        let insideGrid = InsideGrid(selectedBuilding,newPosition)
        let technicalValid = checkTechnicalCollisions(newPosition)
        if (selectedBuilding[1] && insideGrid && !technicalValid) // valid position en boolean van float building
        {
            // No collision, move the building
            selectedBuilding[0].position = newPosition;
            selectedBuilding[0].occupiedCells = occupiedCells[1]
        }
        if (occupiedCells[0])
        {
            selectedBuilding[2] = 0x006f00
        }
        else
        {
            selectedBuilding[2] = 0xff0000
            const sound = new Audio(error);
            sound.currentTime = 0.0;
            sound.volume = 0.1
            sound.play();
        }
        selectedBuilding[3] = occupiedCells[0]
        setSelectedBuilding([selectedBuilding[0], selectedBuilding[1], selectedBuilding[2], selectedBuilding[3]]);
        return [oldPosition,newPosition,occupiedCells]
    };
    useEffect(() =>
    {
        const handleEnterButton = async () =>
        {
            let moved = moveObject(0, 0)
            if (moved[2][0])
            {
                setSelectedBuilding([selectedBuilding[0],!selectedBuilding[1], selectedBuilding[2], selectedBuilding[3]]); //alleen floating boolean veranderen
                const data = await POST({"oldPosition":moved[0], "newPosition": moved[1], "occupiedCells": moved[2][1], "sid": sid}, "/moveBuilding")
            }
        }
        const handleKeyDown = (event) =>
        {
            switch (event.key) {
                case 'ArrowUp':
                    moveObject(0, -1);
                    break;
                case 'ArrowDown':
                    moveObject(0, 1);
                    break;
                case 'ArrowLeft':
                    moveObject(-1, 0);
                    break;
                case 'ArrowRight':
                    moveObject(1, 0)
                    break;
                case 'Enter':
                    handleEnterButton()
                    break;
                default:
                    return;
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () =>
        {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedBuilding]);

    const handleObjectClick = (building) =>
    {
        if (selectedBuilding[3])
        {
            setSelectedBuilding([building, !selectedBuilding[1], selectedBuilding[2], selectedBuilding[3]])
        }
        if (!selectedBuilding[1])
        {
            setOldPosition([building.position[0], building.position[1]]);
        }
    }

    const BuildingMesh = ({building}) =>
    {
        for (let category in BuildingImages)
        {
            for (let buildables in BuildingImages[category])
            {
                const size = BuildingImages[category][buildables][1]
                if (building.type === buildables)
                {
                    building.size = size;
                }
            }
        }
        const meshRef = useRef(); // Define the useRef hook here
        useFrame(() =>
        {
            if (selectedBuilding[0].position === building.position && selectedBuilding[1])
            {
                meshRef.current.position.y = Math.sin(Date.now() * 0.002) + 10; // Adjust the amplitude and speed as needed
            }
        });
        const centerX = building.position[0] + 0.5;
        const centerY = building.position[1] + 0.5;
        const Building = Buildings3D[building.type];
        return (
            <>
                <mesh ref={meshRef} position={[centerX - gridSize / 2, 6, centerY - gridSize / 2 + 0.5]} onClick={() => handleObjectClick(building)}>
                    <Building/>
                </mesh>
                <mesh position={[centerX - gridSize / 2, 6, centerY - gridSize / 2 + 0.5]}>
                    {selectedBuilding[0] === building && selectedBuilding[1] && <primitive object={createShadow(building.size[0],building.size[1], selectedBuilding[2])}/>}
                </mesh>
            </>
        );
    };

    const renderCell = (rowIndex, colIndex) =>
    {
        let buildingFound = false;
        for (let building of buildings)
        {
            if (rowIndex === building.position[0] && colIndex === building.position[1])
            {
                buildingFound = true;
                return (<BuildingMesh key={`${rowIndex}-${colIndex}`} building={building} />);
            }
        }
        if (!buildingFound)
        {
            return (<gridHelper key={`${rowIndex}-${colIndex}`} position={[colIndex - gridSize / 2, 6, rowIndex - gridSize / 2]} args={[1, 1]}
                                material={new THREE.MeshBasicMaterial({ color: 0x000000 })}
            />);
        }
    };


    return (
        <Suspense fallback={null}>
            <Canvas camera={{ position: [20, 30, 60] }} className={"grid"} shadows={true}>
                <directionalLight position={[50,10,5]} intensity={3}/>
                <ambientLight intensity={1}/>
                <hemisphereLight intensity={1}/>
                <OrbitControls enableZoom={true} zoomSpeed={0.5} maxDistance={60} minDistance={0} />
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
                <Ground/>
            </Canvas>
        </Suspense>
    );
}

function createShadow(width, height, shadowColor)
{
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({ color: shadowColor });
    const square = new THREE.Mesh(geometry, material);
    square.position.set(0, 0, 0);
    square.rotation.x =  - Math.PI / 2; // Rotate 90 degrees around the x-axis
    return square
}

function InsideGrid(selectedBuilding, newPosition)
{
    return newPosition[0] < 39 && newPosition[1] < 38 && newPosition[0] >= 0 && newPosition[1] >= 0
}

export default Grid;
