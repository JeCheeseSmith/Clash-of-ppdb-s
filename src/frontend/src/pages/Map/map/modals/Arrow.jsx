import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import arrow from '../assets/arrow.glb'

export default function Arrow({intercept, position, destinationPosition, height})
{
    const { nodes, materials } = useGLTF(arrow)
    const preciseDestinationPosition = [destinationPosition[0]-position[0], destinationPosition[1]-position[1]]
    const angle = Math.atan2(preciseDestinationPosition[0], preciseDestinationPosition[1]) + 0.01;
    const distance = Math.sqrt(Math.pow(preciseDestinationPosition[0], 2) + Math.pow(preciseDestinationPosition[1], 2))  * 0.0068;
    let destinationLength;
    let arrowHeight = height;
    if (arrowHeight > 0)
    {
        arrowHeight -= 0.8
        console.log(arrowHeight)
    }
    if (intercept)
    {
        if (destinationPosition[1] >= position[1])
        {
            destinationLength = -0.6
        }
        else
        {
            destinationLength = 0.6
        }
    }
    else
    {
        destinationLength = 0
    }
    return (
        <group dispose={null} scale={[distance, 0.1, 0.3+arrowHeight]} position={[-1, 6, -1] /* adjusted for precision */ } rotation={[-Math.PI / 2, destinationLength, -angle]}>
            <group>
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Material2.geometry}
                    material={materials.Color_H04_1}
                />
            </group>
        </group>
    )
}

useGLTF.preload(arrow)
