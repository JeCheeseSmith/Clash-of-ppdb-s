import React, {Suspense} from 'react';
import { Canvas } from '@react-three/fiber';
import {OrbitControls, Text} from '@react-three/drei';
import * as THREE from 'three';
import Arrow from "./modals/Arrow.jsx";
import Settlement1 from "./modals/Settlement1.jsx";
import Environment from "./modals/Environment.jsx";
import Landscape from "./modals/Landscape.jsx";
import Settlement2 from "./modals/Settlement2.jsx";
import Settlement3 from "./modals/Settlement3.jsx";
import textFont from './assets/MagelyfreeRegular-DOeXW.otf'
import Capital from "./modals/Capital.jsx";
import PlaySound from "../../../globalComponents/audioComponent/audio.jsx";

const mapSize = 50;

/**
 * Represents a component for displaying and interacting with a map.
 * @param {Object} props - The props object.
 * @param {Function} props.setMenuVisible - Function to set the visibility of the menu.
 * @param {Function} props.setSelectedObject - Function to set the selected object.
 * @param {boolean} props.outpostChosen - Flag indicating if an outpost is chosen.
 * @param {Function} props.setOutpostChosen - Function to set if an outpost is chosen.
 * @param {Object[]} props.settlements - Array of settlements.
 * @param {Object[]} props.timers - Array of timers.
 * @returns {JSX.Element} - The map component.
 */
function Map({setMenuVisible, setSelectedObject, outpostChosen, setOutpostChosen, settlements, timers})
{
    let characteristics
    const handleTransfer = (idTO, toType) =>
    {
        setMenuVisible(true)
        setOutpostChosen(false)
        setSelectedObject({idTO, toType})
        let promise  = PlaySound("Click")
    }
    const handleOutpost = (rowIndex, colIndex) =>
    {
        setMenuVisible(true)
        setSelectedObject([rowIndex, colIndex, true])
        let promise  = PlaySound("Click", 0.1)
    }

    const SettlementMesh = ({settlement, rowIndex, colIndex, characteristics}) =>
    {
        let positionX = colIndex + 0.5 - mapSize / 2
        let positionY = rowIndex + 1 - mapSize / 2
        return (
            <>
                <mesh key={`${rowIndex}-${colIndex}-settlement`}
                      position={[positionX, 6, positionY]}
                      onClick={() => handleTransfer(settlement.sid, false)}
                      scale={2}
                >
                    <characteristics.Type/>
                </mesh>
                {!outpostChosen &&
                    <>
                       <Text position={[positionX, characteristics.height, positionY]}
                               rotation={[-0.5, 0, 0]}
                               scale={characteristics.scale}
                               font={textFont}
                               onClick={() => handleTransfer(settlement.sid, false)}
                       >
                           {characteristics.text}
                           <meshBasicMaterial color={characteristics.color}/>
                       </Text>
                        {characteristics.text === "Capital City" &&
                            <mesh position={[positionX, 10, positionY]}
                                  onClick={() => handleTransfer(settlement.sid, false)}
                            >
                                <Capital/>
                            </mesh>
                        }
                    </>
                }
            </>
        );
    }

    const renderSettlement = (rowIndex, colIndex) =>
    {
        for (let settlement of settlements)
        {
            if (settlement.position[0] === rowIndex && settlement.position[1] === colIndex)
            {
                if (settlement.me && !settlement.isOutpost)
                {
                    characteristics = {Type: Settlement3, text: "Capital City", color: "red", scale: 2.5, height: 12}
                }
                else if ((settlement.me && settlement.isOutpost) || settlement.pname === "admin")
                {
                    characteristics = {Type: Settlement2, text: "Outpost", color: "blue", scale: 2, height: 12}
                }
                else if (settlement.isOutpost || settlement.pname === "admin")
                {
                    characteristics = {Type: Settlement1, text: `${settlement.pname}'s Outpost`, color: "yellow", scale: 1, height: 12}
                }
                else if (settlement.isFriend)
                {
                    characteristics = {Type: Settlement1, text: `${settlement.pname}'s City (Companion)`, color: "purple", scale: 1, height: 9}
                }
                else if (settlement.isAllied)
                {
                    characteristics = {Type: Settlement1, text: `${settlement.pname}'s City (Ally)`, color: "Maroon", scale: 1, height: 9}
                }
                else
                {
                    characteristics = {Type: Settlement1, text: `${settlement.pname}'s City`, color: "white", scale: 0.8, height: 9}
                }
                return (
                    <SettlementMesh settlement={settlement} rowIndex={rowIndex} colIndex={colIndex} characteristics={characteristics}/>
                )
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
                            <Arrow intercept={timer.toType} position={[rowIndex, colIndex]} destinationPosition={timer.to} height={timer.height}/>
                        </mesh>
                    );
                }
            }
        }
        return arrowMeshes
    };

    return (
        <Suspense fallback={null}>
            <Canvas camera={{position: [0, 50, 65]}}>
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
                    enablePan={false}
                />
                {createSettlements(renderSettlement)}
                {createTransfers(renderTransfers)}
                <Landscape/>
                <Environment/>
            </Canvas>
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
