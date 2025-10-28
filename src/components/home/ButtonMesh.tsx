"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Text, Float, Edges } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";

export default function ThreeButton() {
  const router = useRouter();

  function ButtonMesh() {
    const boxRef = useRef<THREE.Mesh>(null);
    const textGroupRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
      setIsDark(document.documentElement.classList.contains("dark"));

      const observer = new MutationObserver(() => {
        setIsDark(document.documentElement.classList.contains("dark"));
      });

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });

      return () => observer.disconnect();
    }, []);

    useFrame(() => {
      if (!boxRef.current || !textGroupRef.current) return;

      // Rotate box
      boxRef.current.rotation.y += hovered ? 0.03 : 0.005;

      // Hover scale
      const targetScale = hovered ? 1.1 : 1;
      boxRef.current.scale.x += (targetScale - boxRef.current.scale.x) * 0.1;
      boxRef.current.scale.y += (targetScale - boxRef.current.scale.y) * 0.1;
      boxRef.current.scale.z += (targetScale - boxRef.current.scale.z) * 0.1;

      // Click shake
      if (clicked) {
        const intensity = 0.08;
        boxRef.current.position.x = (Math.random() - 0.5) * intensity;
        boxRef.current.position.y = (Math.random() - 0.5) * intensity;
      } else {
        boxRef.current.position.x = 0;
        boxRef.current.position.y = 0;
      }

      // Text flip logic
      const boxRotY = boxRef.current.rotation.y % (Math.PI * 2);
      let targetTextRot = 0;

      if (boxRotY > Math.PI / 2 && boxRotY < (3 * Math.PI) / 2) {
        targetTextRot = -Math.PI;
      } else {
        targetTextRot = 0;
      }

      textGroupRef.current.rotation.y +=
        (targetTextRot - textGroupRef.current.rotation.y) * 0.08;
    });

    const handleClick = () => {
      setClicked(true);
      setTimeout(() => {
        setClicked(false);
        router.push("/jobs");
      }, 150);
    };

    const edgeColor = hovered
      ? isDark
        ? "#3d453e"
        : "#8fa896"
      : isDark
      ? "#1a1a1a"
      : "#ffffff";

    const textColor = hovered
      ? isDark
        ? "#3d453e"
        : "#8fa896"
      : isDark
      ? "#000000"
      : "#ffffff";

    return (
      <Float rotationIntensity={0.3} floatIntensity={0.5}>
        <RoundedBox
          ref={boxRef}
          args={[6, 2.5, 0.1]}
          radius={0.2}
          smoothness={4}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={handleClick}
        >
          <meshStandardMaterial color="white" transparent opacity={0} />
          <Edges
            key={edgeColor}
            scale={1.03}
            threshold={15}
            color={edgeColor}
          />
          <group ref={textGroupRef} position={[0, 0, 0.06]}>
            <Text
              font="/fonts/Montserrat-SemiBold.ttf"
              fontSize={0.73}
              color={textColor}
              anchorX="center"
              anchorY="middle"
            >
              GET STARTED
            </Text>
          </group>
        </RoundedBox>
      </Float>
    );
  }

  return (
    <div className="w-[200px] h-[130px] cursor-pointer">
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <ButtonMesh />
      </Canvas>
    </div>
  );
}
