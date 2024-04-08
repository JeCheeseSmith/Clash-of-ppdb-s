import React, {Suspense, useEffect, useState} from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useLocation } from 'react-router-dom';
import './map.css';
import * as API from "../../api/EndPoints/EndPoints.jsx"
import Ground from "./modals/Ground.jsx";
import RequestMassagePopUp from "../../globalComponents/popupMessage/popup.jsx";
import Arrow from "./modals/Arrow.jsx";
import Settlement1 from "./modals/Settlement1.jsx";
import {updateResources, updateTimers} from "../../globalComponents/backgroundFunctions/helperFunctions.jsx";
import LocalTimers from "../../globalComponents/backgroundFunctions/localTimers.jsx";
import ResourceBar from "../Homepage/RecourceBar/resourcebar.jsx";


const mapSize = 50;
function Map()
{
    const { sid, username} = useLocation().state;
    const [resources, setResources] = useState({wood: 0,stone: 0,steel: 0,food: 0});
    const [menuOpen, setMenuOpen] = useState(false)
    const [settlements, setSettlements] = useState([])
    const [timers, setTimers] = useState([])
    const [outpostChosen, setOutpostChosen] = useState(false)
    useEffect(() =>
    {
        updateTimers(username, setTimers)
        API.getMap().then(data => {setSettlements(data)})
    }, []);

    const handleSettlement = (rowIndex, colIndex) =>
    {
        setMenuOpen(true)
    }
    const renderSettlement = (rowIndex, colIndex) =>
    {
        for (let settlement of settlements)
        {
            if (settlement.position[0] === rowIndex && settlement.position[1] === colIndex)
            {
                return (
                    <mesh key={`${rowIndex}-${colIndex}`}
                          position={[colIndex + 0.5 - mapSize / 2, 6, rowIndex + 1 - mapSize / 2]}
                          onClick={() => handleSettlement(rowIndex, colIndex)}
                    >
                        <Settlement1/>
                    </mesh>
                );
            }
        }
        if (outpostChosen)
        {
            return (
                <gridHelper
                    key={`${rowIndex}-${colIndex}`}
                    position={[colIndex - mapSize / 2, 6.1, rowIndex - mapSize / 2]}
                    args={[1, 1]}
                    material={new THREE.MeshBasicMaterial({color: 0x0ff000})}
                />
            );
        }
    };

    const renderTransfers = (rowIndex, colIndex) =>
    {
        for (let timer of timers)
        {
            if (timer.type === "transfer")
            {
                if (timer.from[0] === rowIndex && timer.from[1] === colIndex && timer.discovered)
                {
                    return (
                        <mesh key={`${rowIndex}-${colIndex}`}
                              position={[colIndex + 0.5 - mapSize / 2, 0, rowIndex + 1 - mapSize / 2]}
                              onClick={() => handleSettlement(rowIndex, colIndex)}
                        >
                            <Arrow destinationPosition={timer.to}/>
                        </mesh>
                    );
                }
            }
        }
    };

    return (
        <Suspense fallback={null}>
            <Canvas camera={{position: [-0, 300, 30]}} className={'canvas'}>
                <color attach="background" args={['lightblue']}/>
                <ambientLight intensity={3}/>
                <OrbitControls
                    enableZoom={true}
                    zoomSpeed={0.5}
                    maxDistance={35}
                    minDistance={20}
                    panSpeed={0.25}
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI - Math.PI / 6}
                    minAzimuthAngle={-Math.PI / 6}
                    maxAzimuthAngle={Math.PI / 6}
                    enableRotate={false}
                    mouseButtons={{
                        LEFT: THREE.MOUSE.PAN,
                        MIDDLE: THREE.MOUSE.DOLLY,
                        RIGHT: THREE.MOUSE.ROTATE
                    }} // Change mouse buttons configuration
                />
                {createSettlements(renderSettlement)}
                {createTransfers(renderTransfers)}
                <Ground/>
            </Canvas>
            {menuOpen && <RequestMassagePopUp message={"This is a settlement!"} setPopup={setMenuOpen}/>}
            <ResourceBar resources={resources} updateResources={() => updateResources(sid, setResources)}/>
            <LocalTimers setResources={setResources} timers={timers} setTimers={setTimers}/>
        </Suspense>
    );
}

function createSettlements(renderSettlement)
{
    const renderedCells = [];
    for (let i = 0; i < mapSize; i++)
    {
        const renderedRow = [];
        for (let j = 0; j < mapSize; j++)
        {
            renderedRow.push(renderSettlement(i, j));
        }
        renderedCells.push(renderedRow);
    }
    return renderedCells;
}

function createTransfers(renderTransfers)
{
    const renderedCells = [];
    for (let i = 0; i < mapSize; i++)
    {
        const renderedRow = [];
        for (let j = 0; j < mapSize; j++)
        {
            renderedRow.push(renderTransfers(i, j));
        }
        renderedCells.push(renderedRow);
    }
    return renderedCells;
}

export default Map;
