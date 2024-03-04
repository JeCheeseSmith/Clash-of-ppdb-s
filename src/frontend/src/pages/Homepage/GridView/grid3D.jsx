import React, {Suspense} from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import './grid3D.css'
import House from "./models/House.jsx";

function Grid()
{
    const gridSize = 30;
    const grid = [];
    for (let i = 0; i < gridSize; i++)
    {
        const row = [];
        for (let j = 0; j < gridSize; j++)
        {
            row.push(0);
        }
        grid.push(row);
    }

    const renderCell = (rowIndex, colIndex) =>
    {
        if (rowIndex >= 1 && rowIndex <= 4 && colIndex >= 2 && colIndex <= 5)
        {
            const centerX = (2 + 5) / 2;
            const centerY = (1 + 4) / 2;
            return (
                <mesh key={`${rowIndex}-${colIndex}`} position={[centerX - gridSize / 2, 7, centerY - gridSize / 2]}>
                    <House/>
                </mesh>
            );
        }
        else
        {
            return (
                <gridHelper key={`${rowIndex}-${colIndex}`}
                            position={[colIndex - gridSize / 2, 6, rowIndex - gridSize / 2]}
                            args={[1, 1]}
                />
            );
        }
    };

    return (
        <Suspense fallback={null}>
            <Canvas camera={{ position: [40, 35, 60] }} className={"grid"}>
                <directionalLight/>
                <ambientLight/>
                <pointLight/>
                <spotLight/>
                <hemisphereLight/>
                <OrbitControls enableZoom={true} zoomSpeed={0.5} maxDistance={30} minDistance={15} />
                {
                    grid.map((row, rowIndex) => (
                    row.map((cell, colIndex) => renderCell(rowIndex, colIndex))))
                }
            </Canvas>
        </Suspense>
    );
}

export default Grid;
