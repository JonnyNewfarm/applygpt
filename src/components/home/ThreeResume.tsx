"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import { OrbitControls, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";

export default function ThreeResume() {
  return (
    <div className="w-full h-[70vh] flex justify-center items-center">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 5]} intensity={1.2} />
        <Suspense fallback={null}>
          <ResumeCard />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />
      </Canvas>
    </div>
  );
}

function ResumeCard() {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!groupRef.current) return;

    const targetRotX = hovered ? 0 : -0.22;
    const targetRotY = hovered ? 0 : 0.17;
    groupRef.current.rotation.x +=
      (targetRotX - groupRef.current.rotation.x) * 0.08;
    groupRef.current.rotation.y +=
      (targetRotY - groupRef.current.rotation.y) * 0.08;

    const targetScale = hovered ? 1.2 : 1;
    groupRef.current.scale.x += (targetScale - groupRef.current.scale.x) * 0.08;
    groupRef.current.scale.y += (targetScale - groupRef.current.scale.y) * 0.08;
    groupRef.current.scale.z += (targetScale - groupRef.current.scale.z) * 0.08;
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh position={[0, 0, -0.01]}>
        <boxGeometry args={[3, 4, 0.03]} />
        <meshStandardMaterial
          color="#f9f7f4"
          roughness={0.5}
          metalness={0.05}
        />
      </mesh>

      <Text
        position={[-0.8, 1.6, 0.03]}
        fontSize={0.25}
        color="#2b2a27"
        maxWidth={2.7}
        lineHeight={0.32}
      >
        {"Jane Doe"}
      </Text>
      <Text
        position={[-0.5, 1.2, 0.03]}
        fontSize={0.18}
        color="#2b2a27"
        maxWidth={2.7}
      >
        {"Frontend Developer"}
      </Text>

      <Text
        position={[-0.22, 0.7, 0.03]}
        fontSize={0.15}
        color="#2b2a27"
        maxWidth={2.7}
      >
        {
          "Experience:\n- WebDev Co. (2022-2023)\n- PixelWorks Studio (2021-2022)\n- Freelance Projects (2020-2021)"
        }
      </Text>

      <Text
        position={[-0.5, -0.2, 0.03]}
        fontSize={0.15}
        color="#2b2a27"
        maxWidth={2.7}
      >
        {
          "Projects:\n- E-commerce Platform\n- Portfolio Website\n- Task Management App"
        }
      </Text>
      <Text
        position={[0.08, -1.2, 0.03]}
        fontSize={0.15}
        color="#2b2a27"
        maxWidth={2.7}
      >
        {
          "Education:\n- Techville University, BSc Computer Science (2018-2021)\n- Hackers High School, Diploma (2014-2018)"
        }
      </Text>
    </group>
  );
}
