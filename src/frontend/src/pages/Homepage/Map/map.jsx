import React, {Suspense} from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function Map()
{
    const gridSize = 15;
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

        return (
            <gridHelper key={`${rowIndex}-${colIndex}`}
                        position={[colIndex - gridSize / 2, 3, rowIndex - gridSize / 2]}
                        args={[1, 1]}
            />
        );

    };

    return (
        <Suspense fallback={null}>
            <Canvas camera={{ position: [12, 20, 12] }}>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <OrbitControls enableZoom={true} zoomSpeed={0.5} maxDistance={500} minDistance={0} />
            {
                grid.map((row, rowIndex) => (
                row.map((cell, colIndex) => renderCell(rowIndex, colIndex))))
            }
        </Canvas>
        </Suspense>

    );
}

export default Map;