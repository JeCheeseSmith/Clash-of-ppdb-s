import React, {Suspense, useState} from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useLocation } from 'react-router-dom';
import './map.css';
import Settlement1 from "./modals/Settlement1.jsx";
import Settlement2 from "./modals/Settlement2.jsx";
import RequestMassagePopUp from "../../globalComponents/popupMessage/popup.jsx";

function Map() {
    const { sid, username } = useLocation().state;
    const mapSize = 50;
    const [menuOpen, setMenuOpen] = useState(false)

    const handleSettlement = () =>
    {
        setMenuOpen(true)
    }

    const renderCell = (rowIndex, colIndex) =>
    {
        if (colIndex % 7 === 0 && rowIndex % 8 === 0)
        {
            const centerX = rowIndex + 0.5;
            const centerY = colIndex + 0.5;
            return (
                <>
                    <mesh key={`${rowIndex}-${colIndex}`}
                          position={[centerX - mapSize / 2, 6, centerY - mapSize / 2 + 0.5]}
                          onClick={handleSettlement}
                    >
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
                <mesh key={`${rowIndex}-${colIndex}`}
                      position={[centerX - mapSize / 2, 6, centerY - mapSize / 2 + 0.5]}
                      onClick={handleSettlement}
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
                        position={[colIndex - mapSize / 2, 6, rowIndex - mapSize / 2]}
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
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI - Math.PI / 6}
                    minAzimuthAngle={-Math.PI / 6}
                    maxAzimuthAngle={Math.PI / 6}
                    enableRotate={false}
                    mouseButtons={{ LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE }} // Change mouse buttons configuration
                />
                {(() => {
                    const renderedCells = [];
                    for (let i = 0; i < mapSize; i++)
                    {
                        const renderedRow = [];
                        for (let j = 0; j < mapSize; j++)
                        {
                            renderedRow.push(renderCell(j, i));
                        }
                        renderedCells.push(renderedRow);
                    }
                    return renderedCells;
                })()}
            </Canvas>
            {menuOpen && <RequestMassagePopUp message={"This is a settlement!"} setPopup={setMenuOpen}/>}
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
