/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Author: sanderd17 (https://sketchfab.com/sanderd17)
License: CC-BY-SA-4.0 (http://creativecommons.org/licenses/by-sa/4.0/)
Source: https://sketchfab.com/3d-models/seleucid-barracks-5fd006fd328842d78c69241ba14cdc88
Title: Seleucid Barracks
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import barracks from '../../../assets/barracks.glb'

/**
 * React component for rendering a 3D model of Seleucid Barracks.
 * @param {object} props - Props passed to the component.
 * @returns {JSX.Element} JSX representation of the barracks.
 */
export default function Barracks({props}) {
  const { nodes, materials } = useGLTF(barracks)
  return (
    <group {...props} dispose={null} scale={0.24+props} position={[1.5,1.45,1.45]}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_3.geometry}
          material={materials.Collada_visual_scene_group}
          position={[0, 5.372, 3.477]}
        />
      </group>
    </group>
  )
}

useGLTF.preload(barracks)
