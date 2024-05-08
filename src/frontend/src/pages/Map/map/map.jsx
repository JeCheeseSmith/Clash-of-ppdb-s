import React, {Suspense, useEffect, useState} from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useLocation } from 'react-router-dom';
import * as API from "../../../api/EndPoints/EndPoints.jsx"
import Arrow from "./modals/Arrow.jsx";
import Settlement1 from "./modals/Settlement1.jsx";
import {updateResources, updateTimers} from "../../../globalComponents/backgroundFunctions/helperFunctions.jsx";
import LocalTimers from "../../../globalComponents/backgroundFunctions/localTimers.jsx";
import ResourceBar from "../../Homepage/RecourceBar/resourcebar.jsx";
import Environment from "./modals/Environment.jsx";
import Landscape from "./modals/Landscape.jsx";
import Settlement2 from "./modals/Settlement2.jsx";
import Settlement3 from "./modals/Settlement3.jsx";

/**
 * Represents a component for displaying and interacting with a map.
 * @param {object} props - The props object.
 * @param {Function} props.setMenuVisible - A function to set the visibility of the menu.
 * @param {Function} props.setSelectedObject - A function to set the selected object.
 * @param {boolean} props.outpostChosen - A boolean indicating if an outpost is chosen.
 * @param {Function} props.setOutpostChosen - A function to set if an outpost is chosen.
 * @returns {JSX.Element} Map component.
 */
const mapSize = 50;
function Map({setMenuVisible, setSelectedObject, outpostChosen, setOutpostChosen})
{
    const {sid, username} = useLocation().state;
    const [resources, setResources] = useState({wood: 0,stone: 0,steel: 0,food: 0});
    const [settlements, setSettlements] = useState([])
    const [timers, setTimers] = useState([])

    const handleTransfer = (idTO, toType) =>
    {
        setMenuVisible(true)
        setOutpostChosen(false)
        setSelectedObject({idTO, toType})
    }
    const handleOutpost = (rowIndex, colIndex) =>
    {
        setMenuVisible(true)
        setSelectedObject([rowIndex, colIndex])
    }

    const renderSettlement = (rowIndex, colIndex) =>
    {
        for (let settlement of settlements)
        {
            if (settlement.position[0] === rowIndex && settlement.position[1] === colIndex)
            {
                if (settlement.me && !settlement.isOutpost)
                {
                    return (
                        <mesh key={`${rowIndex}-${colIndex}-settlement`}
                              position={[colIndex + 0.5 - mapSize / 2, 6, rowIndex + 1 - mapSize / 2]}
                              onClick={() => handleTransfer(settlement.sid, false)}
                              scale={2}
                        >
                            <Settlement3/>
                        </mesh>
                    );
                }
                else if (settlement.me && settlement.isOutpost)
                {
                    return (
                        <mesh key={`${rowIndex}-${colIndex}-settlement`}
                              position={[colIndex + 0.5 - mapSize / 2, 6, rowIndex + 1 - mapSize / 2]}
                              onClick={() => handleTransfer(settlement.sid, false)}
                              scale={2}
                        >
                            <Settlement2/>
                        </mesh>
                    );
                }
                else
                {
                    return (
                        <mesh key={`${rowIndex}-${colIndex}-settlement`}
                              position={[colIndex + 0.5 - mapSize / 2, 6, rowIndex + 1 - mapSize / 2]}
                              onClick={() => handleTransfer(settlement.sid, false)}
                              scale={2}
                        >
                            <Settlement1/>
                        </mesh>
                    );
                }
            }
        }
        if (outpostChosen)
        {
            return (
                <gridHelper
                    key={`${rowIndex}-${colIndex}-grid`}
                    position={[colIndex - mapSize / 2, 5.9, rowIndex - mapSize / 2]}
                    args={[1, 1]}
                    material={new THREE.MeshBasicMaterial({color: 0x0ff000})}
                    onClick={() => handleOutpost(rowIndex, colIndex)}
                />
            );
        }
    };

    const renderTransfers = (rowIndex, colIndex) =>
    {
        let arrowMeshes = []
        for (let timer of timers)
        {
            if (timer.type === "transfer" || timer.type === "attack" || timer.type === "outpost")
            {
                if (timer.from[0] === rowIndex && timer.from[1] === colIndex && timer.discovered && timer.to)
                {
                    arrowMeshes.push(
                        <mesh key={`${rowIndex}-${colIndex}-${timer.to}`}
                              position={[colIndex + 0.5 - mapSize / 2, 0, rowIndex + 1 - mapSize / 2]}
                              onClick={() => handleTransfer(timer.tid, true)}
                        >
                            <Arrow intercept={timer.toType} position={[rowIndex, colIndex]} destinationPosition={timer.to}/>
                        </mesh>
                    );
                }
            }
        }
        return arrowMeshes
    };

    return (
        <Suspense fallback={null}>
            <LocalTimers setResources={setResources} timers={timers} setTimers={setTimers} setSettlements={setSettlements}/>
            <Canvas camera={{position: [0, 10, 30]}}>
                {/*<color attach="background" args={['lightblue']}/>*/}
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
                <OrbitControls
                    enableZoom={true}
                    zoomSpeed={0.7}
                    rotateSpeed={0.1}
                    maxDistance={50}
                    minDistance={20}
                    maxPolarAngle={Math.PI / 2.5}
                    minPolarAngle={Math.PI / 5}
                    maxAzimuthAngle={Math.PI / 2}
                    minAzimuthAngle={Math.PI / 5}
                    enablePan={false}
                />
                {createSettlements(renderSettlement)}
                {createTransfers(renderTransfers)}
                <Landscape/>
                <Environment/>
            </Canvas>
            <ResourceBar resources={resources} updateResources={() => updateResources(sid, setResources)}/>
        </Suspense>
    );
}

function createSettlements(renderSettlement) {
    const renderedCells = [];
    for (let i = 0; i < mapSize; i++) {
        const renderedRow = [];
        for (let j = 0; j < mapSize; j++) {
            renderedRow.push(renderSettlement(i, j));
        }
        renderedCells.push(renderedRow);
    }
    return renderedCells;
}

function createTransfers(renderTransfers) {
    const renderedCells = [];
    for (let i = 0; i < mapSize; i++) {
        const renderedRow = [];
        for (let j = 0; j < mapSize; j++) {
            renderedRow.push(renderTransfers(i, j));
        }
        renderedCells.push(renderedRow);
    }
    return renderedCells;
}

export default Map;
