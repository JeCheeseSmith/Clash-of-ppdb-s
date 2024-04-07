import React, {Suspense, useState} from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useLocation } from 'react-router-dom';
import './map.css';
import Settlement1 from "./modals/Settlement1.jsx";
import Ground from "./modals/Ground.jsx";
import RequestMassagePopUp from "../../globalComponents/popupMessage/popup.jsx";
import Arrow from "./modals/Arrow.jsx";
function Map()
{
    const { sid, username } = useLocation().state;
    const mapSize = 50;
    const [menuOpen, setMenuOpen] = useState(false)


    const handleSettlement = (rowIndex, colIndex) =>
    {
        setMenuOpen(true)
    }
    const renderCell = (rowIndex, colIndex) =>
    {
        if (rowIndex === 0 && colIndex === 0)
        {
            return (
                <mesh key={`${rowIndex}-${colIndex}`}
                      position={[colIndex - mapSize / 2, 0, rowIndex - mapSize / 2]}
                      onClick={() => handleSettlement(rowIndex, colIndex)}
                >
                    <Arrow destinationPosition={[25,25]}/>
                </mesh>
            );
        }
        else {
            return (
                <>
                    <gridHelper
                        key={`${rowIndex}-${colIndex}`}
                        position={[colIndex - mapSize / 2, 6.1, rowIndex - mapSize / 2]}
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
                <color attach="background" args={['lightblue']}/>
                <ambientLight intensity={3}/>
                <OrbitControls
                    enableZoom={true}
                    zoomSpeed={0.5}
                    maxDistance={35}
                    minDistance={30}
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
                {(() => {
                    const renderedCells = [];
                    for (let i = 0; i < mapSize; i++) {
                        const renderedRow = [];
                        for (let j = 0; j < mapSize; j++) {
                            renderedRow.push(renderCell(i, j));
                        }
                        renderedCells.push(renderedRow);
                    }
                    return renderedCells;
                })()}
                <Ground/>
            </Canvas>
            {menuOpen && <RequestMassagePopUp message={"This is a settlement!"} setPopup={setMenuOpen}/>}
        </Suspense>
    );
}

export default Map;
