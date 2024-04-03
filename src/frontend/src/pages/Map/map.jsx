import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useLocation } from 'react-router-dom';
import './map.css';
import Settlement1 from "./modals/Settlement1.jsx";
import Settlement2 from "./modals/Settlement2.jsx";

function Map() {
    const { sid, username } = useLocation().state;
    const gridSize = 50;

    const handleGridClick = (rowIndex, colIndex) =>
    {
        console.log(rowIndex, colIndex)
    }

    const renderCell = (rowIndex, colIndex) =>
    {
        if (colIndex % 7 === 0 && rowIndex % 8 === 0)
        {
            const centerX = rowIndex + 0.5;
            const centerY = colIndex + 0.5;
            return (
                <>
                    <mesh position={[centerX - gridSize / 2, 6, centerY - gridSize / 2 + 0.5]}>
                        <Settlement1/>
                    </mesh>
                </>
            );
        }
        else if (colIndex % 9 === 0 && rowIndex % 13 === 0)
        {
            const centerX = rowIndex + 0.5;
            const centerY = colIndex + 0.5;
            return (
                <mesh key={`${rowIndex}-${colIndex}`} position={[centerX - gridSize / 2, 6, centerY - gridSize / 2 + 0.5]}
                      onClick={() => {handleGridClick(rowIndex, colIndex)}}
                >
                    <Settlement2 />
                </mesh>
            );
        }
        else {
            return (
                <>
                    <gridHelper
                        key={`${rowIndex}-${colIndex}`}
                        position={[colIndex - gridSize / 2, 6, rowIndex - gridSize / 2]}
                        args={[1, 1]}
                        material={new THREE.MeshBasicMaterial({color: 0x0ff000})}
                    />
                </>
            );
        }
    };

    return (
        <Suspense fallback={null}>
            <Canvas camera={{position: [-0, 300, 30]}} className={'canvas'}>
            <directionalLight position={[50, 10, 5]} intensity={3}/>
                <ambientLight intensity={1}/>
                <hemisphereLight intensity={1}/>
                <OrbitControls
                    enableZoom={true}
                    zoomSpeed={0.5}
                    maxDistance={13}
                    minDistance={8}
                    panSpeed={0.4}
                    enableRotate={false} // Disable rotation here
                    mouseButtons={{ LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE }} // Change mouse buttons configuration
                />
                {(() => {
                    const renderedCells = [];
                    for (let i = 0; i < gridSize; i++) {
                        const renderedRow = [];
                        for (let j = 0; j < gridSize; j++) {
                            renderedRow.push(renderCell(j, i));
                        }
                        renderedCells.push(renderedRow);
                    }
                    return renderedCells;
                })()}
            </Canvas>
        </Suspense>
    );
}

function createSquare()
{
    const geometry = new THREE.PlaneGeometry(1,1);
    const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const square = new THREE.Mesh(geometry, material);
    square.rotation.x =  - Math.PI / 2; // Rotate 90 degrees around the x-axis
    return square
}

export default Map;
