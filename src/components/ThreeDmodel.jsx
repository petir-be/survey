"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import React from "react";

function Model({ url, scale }) {
  const { scene, animations } = useGLTF(url);
  const { actions } = useAnimations(animations, scene);

  React.useEffect(() => {
    if (actions) {
      Object.values(actions).forEach((action) => action.play());
    }
  }, [actions]);

  return <primitive object={scene} scale={scale} />;
}

export default function ThreeDModel({ url, scale = 1 }) {
  return (
    <Canvas camera={{ position: [2, 2, 3], fov: 45 }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Model url={url} scale={scale} />
      <OrbitControls />
    </Canvas>
  );
}
/*
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import React from "react";

function Model({ url, scale, position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const { scene, animations } = useGLTF(url);
  const { actions } = useAnimations(animations, scene);

  React.useEffect(() => {
    if (actions) {
      Object.values(actions).forEach((action) => action.play());
    }
  }, [actions]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

export default function ThreeDModel({
  url,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) {
  return (
    <Canvas camera={{ position: [2, 2, 3], fov: 45 }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      <Model url={url} scale={scale} position={position} rotation={rotation} />

      <OrbitControls />
    </Canvas>
  );
}
*/