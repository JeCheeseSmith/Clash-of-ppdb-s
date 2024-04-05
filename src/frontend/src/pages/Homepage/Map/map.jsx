import React, {Suspense} from 'react';
import {Canvas} from '@react-three/fiber';
import {OrbitControls} from '@react-three/drei';
import * as THREE from "three";
import {useLocation} from "react-router-dom";

function Map()
{
    const { sid, username } = useLocation().state;
    const gridSize = 40;
    const renderCell = (rowIndex, colIndex) =>
    {
        let buildingFound = false;
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

export default Map;
