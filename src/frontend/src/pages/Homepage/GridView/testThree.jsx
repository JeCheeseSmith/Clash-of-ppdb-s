import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei'; // Import OrbitControls from @react-three/drei
import { GridHelper } from 'three';

function Grid() {
  return (
    <Canvas camera={{ position: [7, 8, 8] }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />
      <gridHelper args={[10, 10]} />
    </Canvas>
  );
}

export default Grid;
