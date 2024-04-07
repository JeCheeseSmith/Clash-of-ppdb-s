import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import arrow from '../assets/arrow.glb'

export default function Arrow({destinationPosition /* for example: [10,10]*/})
{
    const { nodes, materials } = useGLTF(arrow)
    const radians = Math.atan2(destinationPosition[0], destinationPosition[1]) + 0.01;
    const distance = Math.sqrt(Math.pow(destinationPosition[0], 2) + Math.pow(destinationPosition[1], 2));
    const scale = distance * 0.0072;
    console.log(radians, distance, scale)
    return (
        <group dispose={null} scale={scale} position={[-2, 6, 0]}>
            <group rotation={[-Math.PI / 2, 0, -radians]}>
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
