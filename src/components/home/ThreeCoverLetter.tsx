"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import { OrbitControls, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";

export default function ThreeCoverLetter() {
  return (
    <div className="w-full h-[70vh] flex justify-center items-center">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[-3, 3, 5]} intensity={1.2} />
        <Suspense fallback={null}>
          <CoverLetterCard />
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

function CoverLetterCard() {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!groupRef.current) return;

    const targetRotX = hovered ? 0 : -0.22;
    const targetRotY = hovered ? 0 : -0.17;
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
      position={[0, 0, 0]}
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
        position={[-0.6, 1.6, 0.03]}
        fontSize={0.15}
        color="#2b2a27"
        maxWidth={2.7}
      >
        {"Dear Hiring Manager,"}
      </Text>

      <Text
        position={[-0.02, 0.9, 0.03]}
        fontSize={0.15}
        color="#2b2a27"
        maxWidth={2.7}
      >
        {
          "I am excited to apply for the Frontend Developer role at BrightTech Solutions. My experience with React and Next.js makes me confident I can contribute effectively."
        }
      </Text>

      <Text
        position={[-0.02, -0.15, 0.03]}
        fontSize={0.15}
        color="#2b2a27"
        maxWidth={2.7}
      >
        {
          "At WebDev Co., I built responsive interfaces and worked with designers to deliver clean, maintainable, and user-friendly web experiences."
        }
      </Text>

      <Text
        position={[-0.02, -1, 0.03]}
        fontSize={0.15}
        color="#2b2a27"
        maxWidth={2.7}
      >
        {
          "I would love the opportunity to bring my skills and creativity to BrightTech Solutions."
        }
      </Text>

      <Text
        position={[-1.05, -1.6, 0.03]}
        fontSize={0.15}
        color="#2b2a27"
        maxWidth={2.7}
      >
        {"Sincerely,\nJane Doe"}
      </Text>
    </group>
  );
}
