import React, {Suspense, useEffect, useRef, useState} from 'react';
import {Canvas, useFrame} from '@react-three/fiber';
import {OrbitControls} from '@react-three/drei';
import * as THREE from "three";
import GridCalculation from "../gridCalculation.jsx";
import Buildings from "../buildings.jsx";
import POST from "../../../../api/POST.jsx";
import {useLocation} from "react-router-dom";
import UpgradeBuilding from "./upgradeBuilding/upgradeBuilding.jsx";
import PlaySound from "../../../../globalComponents/audioComponent/audio.jsx";
import Ground from "./models/Objects/Ground.jsx";
import Bush from "./models/Objects/Bush.jsx";
import BackgroundTree from "./models/Objects/BackgroundTree.jsx";
import Mountain from "./models/Objects/Mountain.jsx";
import Cobblestones from "./models/Objects/Cobblestones.jsx";
/**
 * A 3D grid component with interactive cells and objects.
 * @component
 * @param {Object[]} buildings - Array of buildings.
 * @param addBuildings
 * @return {JSX.Element} A React JSX Element representing the 3D grid.
 */

function Grid({buildings, randomArray, getTimer, setCallForUpdate})
{
    const { sid, username } = useLocation().state;
    const [selectedBuilding, setSelectedBuilding] =
        useState([[] /* building */,false /* selected or floating */, 0x006f00 /* shadowColor */])
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
            let promise = PlaySound("ObjectPlacementError");
        }
        setSelectedBuilding([selectedBuilding[0], selectedBuilding[1], selectedBuilding[2]]);
        return [oldPosition,newPosition,occupiedCells]
    };
    useEffect(() =>
    {
        const handleEnterButton = async () =>
        {
            let moved = moveObject(0, 0)
            if (moved[2][0] && selectedBuilding[1])
            {
                setSelectedBuilding([selectedBuilding[0],false, selectedBuilding[2]]); //alleen floating boolean veranderen
                if (moved[0] !== moved[1])
                {
                    await POST({"oldPosition":moved[0], "newPosition": moved[1], "occupiedCells": moved[2][1], "sid": sid}, "/moveBuilding")
                    setCallForUpdate(true)
                }
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
        if (!selectedBuilding[1])
        {
            setSelectedBuilding([building, true, selectedBuilding[2]])
            setOldPosition([building.position[0], building.position[1]]);
        }
    }

    const BuildingMesh = ({building}) =>
    {
        if (building.type === "SatelliteCastle") {building.type = "Castle"}
        let Building;
        for (let category in Buildings)
        {
            for (let buildables in Buildings[category])
            {
                const size = Buildings[category][buildables][2]
                if (building.type === buildables)
                {
                    building.size = size;
                    Building = Buildings[category][buildables][1]
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
        return (
            <>
                <mesh ref={meshRef} position={[centerX - gridSize / 2, 6, centerY - gridSize / 2 + 0.5]} onClick={() => handleObjectClick(building)}>
                    <Building props={0}/>
                </mesh>
                <mesh position={[centerX - gridSize / 2, 6, centerY - gridSize / 2 + 0.5]}>
                    {selectedBuilding[0] === building && selectedBuilding[1] && <primitive object={createShadow(building, selectedBuilding[2])}/>}
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
        if (selectedBuilding[1])
        {
            return (<gridHelper key={`${rowIndex}-${colIndex}`} position={[colIndex - gridSize / 2, 6.2, rowIndex - gridSize / 2]} args={[1, 1]}
                                material={new THREE.MeshBasicMaterial({ color: 0x000000 })}
            />);
        }
    };

    return (
        <Suspense fallback={null} >
            <Canvas camera={{position: [3, 35, 15]}} shadows={true}>
                <color attach="background" args={['lightblue']}/>
                <directionalLight
                    position={[50, 50, 50]} // Position of the light source
                    intensity={3} // Intensity of the light
                    castShadow={true} // Enable shadow casting
                    shadow-mapSize-width={2048} // Shadow map width
                    shadow-mapSize-height={2048} // Shadow map height
                    shadow-camera-far={100} // Far plane of the shadow camera
                    shadow-camera-left={-50} // Left frustum edge of the shadow camera
                    shadow-camera-right={50} // Right frustum edge of the shadow camera
                    shadow-camera-top={50} // Top frustum edge of the shadow camera
                    shadow-camera-bottom={-50} // Bottom frustum edge of the shadow camera
                    shadow-bias={-0.01} // Shadow bias to reduce artifacts
                />
                <ambientLight intensity={0.5}/>
                <OrbitControls
                    enableZoom={true}
                    enablePan={false}
                    zoomSpeed={0.2}
                    rotateSpeed={0.1}
                    maxDistance={45}
                    minDistance={25}
                    maxPolarAngle={Math.PI / 3}
                    minPolarAngle={Math.PI / 10}
                    maxAzimuthAngle={Math.PI / 3}
                    minAzimuthAngle={Math.PI / 5}
                />
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
                {createBushes(randomArray)}
                {createTree()}
                <Ground/>
                <Cobblestones position={[12,5.7,0]}/>
                <Cobblestones position={[-10,5.8,0]}/>

                <Mountain position={[-40,2,-70]}/>
                <Mountain position={[-40,-2,-10]}/>
                <Mountain position={[-10,2,-150]}/>
                <Mountain position={[50,2,-150]}/>
            </Canvas>
            {selectedBuilding[1] &&
                <UpgradeBuilding selectedBuilding={selectedBuilding}
                                 oldPosition={oldPosition}
                                 getTimer={getTimer}
                                 setCallForUpdate={setCallForUpdate}
                />}
        </Suspense>
    );
}

function createShadow(building, shadowColor)
{
    const geometry = new THREE.PlaneGeometry(building.size[0],building.size[1]);
    const material = new THREE.MeshBasicMaterial({ color: shadowColor });
    const square = new THREE.Mesh(geometry, material);
    square.position.set(building.size[0]*0.5-1, 0.2, building.size[1]*0.5-1.5);
    square.rotation.x =  - Math.PI / 2; // Rotate 90 degrees around the x-axis
    return square
}

function createBushes(randomArray)
{
    let counter = 0;
    const bushes = [];
    for (let i = 21.5; i <= 45; i += 3)
    {
        for (let j = 0; j < 10; j++)
        {
            // LEFT
            bushes.push([-i, 8, -j * 5]);
            bushes.push([-i, 8, j * 5]);
            // RIGHT
            if (j < 5)
            {
                bushes.push([i, 8, j * 5]);
            }
            bushes.push([i, 8, -j * 5]);
            // TOP
            bushes.push([j * 5, 8, -i]);
            bushes.push([-j * 5, 8, -i]);
            // BOTTOM
            if (j < 5)
            {
                bushes.push([j * 5, 8, i]);
            }
            bushes.push([-j * 5, 8, i]);
        }
        for (let j = 0; j < 5; j++)
        {
            // LEFT
            bushes.push([-i, 8, j * 5+randomArray[counter]]);
            counter++
            bushes.push([-i, 8, -j * 5+randomArray[counter]]);
            counter++
            // TOP
            bushes.push([j * 5 +randomArray[counter], 8, -i]);
            counter++
            bushes.push([-j * 5 +randomArray[counter], 8, -i]);
            counter++
        }
    }
    const bushComponents = [];
    for (let i = 0; i < bushes.length; i++)
    {
        bushComponents.push(<Bush key={i} position={bushes[i]} />);
    }
    return bushComponents
}

function createTree()
{
    const trees = [];
    for (let i = 0; i <= 40; i+=12)
    {
        // LEFT
        trees.push([-30, 20, i]);
        trees.push([-30, 20, -i]);
        trees.push([i, 20, -30]);
        trees.push([-i, 20, -30]);

        trees.push([-35, 20, i+5]);
        trees.push([-35, 20, -i+5]);
        trees.push([i+4, 20, -40]);
        trees.push([-i+4, 20, -40]);
    }
    const treeComponents = [];
    for (let i = 0; i < trees.length; i++)
    {
        treeComponents.push(<BackgroundTree key={i} position={trees[i]} />);
    }
    return treeComponents
}

function InsideGrid(selectedBuilding, newPosition)
{
    return newPosition[0] <= 40 - selectedBuilding[0].size[0] && newPosition[1] <= 40 - selectedBuilding[0].size[1] && newPosition[0] >= 0 && newPosition[1] >= 0
}

export default Grid;
