import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import './grid3D.css'
import House from "./models/House.jsx";

/**
 * A 3D grid component with interactive cells and a house.
 * @component
 * @return {JSX.Element} A React JSX Element representing the 3D grid.
 */
function Grid()
{
    const gridSize = 40;
    // State variable to hold the coordinates of the house
    const [housePosition, setHousePosition] = useState({location:[4, 3], type:"house"}); // Initial position

    const handleCellClick = (rowIndex, colIndex) =>
    {
        setHousePosition({location:[rowIndex, colIndex], type: "house"})
    };

    const renderCell = (rowIndex, colIndex) =>
    {
        if (rowIndex === housePosition.location[0] && colIndex === housePosition.location[1])
        {
            // Calculate the center position of the cell
            const centerX = colIndex + 0.5;
            const centerY = rowIndex + 0.5;
            return (
                <mesh key={`${rowIndex}-${colIndex}`}
                      position={[centerX - gridSize / 2, 6, centerY - gridSize / 2 + 0.5]}
                >
                    <House />
                </mesh>
            );
        }
        else
        {
            return (
                <gridHelper key={`${rowIndex}-${colIndex}`}
                            position={[colIndex - gridSize / 2, 6, rowIndex - gridSize / 2]}
                            args={[1, 1]}
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                />
            );
        }
    };

    return (
        <Suspense fallback={null}>
            <Canvas camera={{ position: [40, 35, 60] }} className={"grid"}>
                <directionalLight />
                <ambientLight />
                <pointLight />
                <spotLight />
                <hemisphereLight />
                <OrbitControls enableZoom={true} zoomSpeed={0.5} maxDistance={42} minDistance={0} />
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
            </Canvas>
        </Suspense>
    );
}

export default Grid;
