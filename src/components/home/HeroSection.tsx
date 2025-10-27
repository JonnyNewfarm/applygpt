"use client";

import React, { useRef, useEffect, useState } from "react";
import MagneticComp from "../MagneticComp";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { AnimatePresence, useScroll } from "framer-motion";
import * as THREE from "three";
import { motion } from "framer-motion";

function FlockBirds() {
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useScroll();

  // Cast to a type that definitely has scene & animations
  const gltf = useGLTF("/birds.glb") as {
    scene: THREE.Group;
    animations: THREE.AnimationClip[];
  };

  const { scene, animations } = gltf;
  const { actions } = useAnimations(animations, groupRef);

  useEffect(() => {
    if (!actions) return;
    Object.values(actions).forEach((action: THREE.AnimationAction | null) => {
      if (!action) return;
      action.timeScale = 0.4;
      action.play();
    });
  }, [actions]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    const scrollProgress = scroll.scrollYProgress.get();
    const startX = 3; // right side
    const endX = -2; // left side
    const xOffset = startX + (endX - startX) * scrollProgress; // moves  as you scroll

    const baseY = 1.5;
    const baseZ = 0;

    groupRef.current.children.forEach((bird: THREE.Object3D, i: number) => {
      const angle =
        (i / groupRef.current!.children.length) * Math.PI * 2 + t * 0.015;
      const radius = 0.6 + Math.sin(t + i) * 0.015;

      // Position relative to scroll
      bird.position.set(
        xOffset + Math.cos(angle) * radius,
        baseY + Math.sin(angle) * radius,
        baseZ + Math.sin(t + i * 0.3) * 0.1
      );

      // Rotation to face forward/right
      bird.rotation.y = Math.sin(t + i) * 0.2 - Math.PI / 6;
      bird.rotation.x = Math.cos(t + i * 0.3) * 0.05;

      bird.traverse((child: THREE.Object3D) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if ((mesh.material as THREE.Material).hasOwnProperty("color")) {
            (mesh.material as THREE.MeshStandardMaterial).color.set(
              document.documentElement.classList.contains("dark")
                ? "#454743"
                : "white"
            );
          }
        }
      });
    });
  });

  return (
    <group
      ref={groupRef}
      rotation={[0, Math.PI * 3, 0]}
      position={[4.3, 1.8, 0]}
    >
      <primitive
        object={scene}
        scale={2.5}
        position={[-scene.position.x, -scene.position.y, -scene.position.z]}
      />
    </group>
  );
}

export default function HeroSection() {
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const path = useRef<SVGPathElement | null>(null);

  const progress = useRef(0);
  const time = useRef(Math.PI / 2);
  const reqId = useRef<number | null>(null);

  const setPath = (p: number) => {
    if (!path.current || typeof window === "undefined") return;
    const innerWidth = window.innerWidth;
    const width = innerWidth + 0.7;
    path.current.setAttributeNS(
      null,
      "d",
      `M0 50 Q${innerWidth / 2} ${50 + p}, ${width} 50`
    );
  };

  const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;

  const animateOut = () => {
    const newProgress = progress.current + Math.sin(time.current) * 4;
    time.current += 0.38;
    setPath(newProgress);
    progress.current = lerp(progress.current, 0, 0.11);
    if (Math.abs(progress.current) > 0.25) {
      reqId.current = requestAnimationFrame(animateOut);
    } else {
      time.current = Math.PI / 2;
      progress.current = 0;
    }
  };

  const manageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    progress.current += e.movementY;
    setPath(progress.current);
  };
  const manageMouseLeave = () => animateOut();
  const manageMouseEnter = () => {
    if (reqId.current !== null) {
      cancelAnimationFrame(reqId.current);
      time.current = Math.PI / 2;
      progress.current = 0;
    }
  };

  useEffect(() => {
    setPath(0);
    const handleResize = () => setPath(0);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#2b2a27] text-[#f6f4ed] px-4 sm:px-20 flex justify-center items-center overflow-hidden dark:bg-[#f6f4f2] dark:text-[#2b2a27]">
      {/* Hero Text */}
      <div className="w-full text-left -mt-10 h-full flex flex-col sm:gap-y-6 gap-y-2 relative z-10">
        <h1 className="sm:text-3xl md:text-4xl uppercase text-xl font-bold">
          Simplify Job Searching
        </h1>

        {/* Interactive SVG line */}
        <div className="w-full h-[1px] mb-[5px] hidden sm:block relative">
          <div
            onMouseEnter={manageMouseEnter}
            onMouseMove={manageMouseMove}
            onMouseLeave={manageMouseLeave}
            className="h-[40px] hover:h-[150px] hover:top-[-75px] z-50 absolute top-[-20px] w-full"
          />
          <svg className="h-[100px] w-full relative top-[-60px]">
            <path
              className="stroke-[#f6f4ed] dark:stroke-black/70 fill-none stroke-[2px]"
              ref={path}
              style={{ strokeLinecap: "round", strokeLinejoin: "round" }}
            />
          </svg>
        </div>

        {/* Subtitle */}
        <div className="flex sm:-mt-6 flex-col gap-y-3 md:gap-y-1">
          <div className="md:text-xl text-base lg:text-2xl sm:text-lg">
            <p className="mb-2">
              All-in-one <strong>AI tools</strong> to build resumes, write
              tailored cover letters, and discover
            </p>
            <p>
              job opportunities from top platforms like{" "}
              <strong>LinkedIn</strong>, <strong>Indeed</strong>, and more —
              fast.
            </p>
          </div>

          {/* Get Started Button */}
          <div className="mt-3 md:mt-5">
            <MagneticComp>
              <div className="card-wrapper w-[150px] h-[50px]">
                <Link
                  href="/jobs"
                  className="card-content font-semibold flex items-center justify-center text-md"
                >
                  Get Started
                </Link>
              </div>
            </MagneticComp>
          </div>
        </div>
      </div>

      {/* Birds Canvas */}
      <div className="absolute top-0 right-6 w-full md:w-1/2 h-full pointer-events-none z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 5, 5]} intensity={0.7} />
          <FlockBirds />
        </Canvas>
      </div>

      {/* Bottom Generate / Find Jobs Buttons */}
      <div className="absolute bottom-26 left-0 w-full flex justify-between px-6 sm:px-20 z-10 font-bold text-lg sm:text-2xl md:text-4xl">
        <AnimatePresence>
          {isGenerateModalOpen && (
            <motion.div
              ref={modalRef}
              key="generate-modal"
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ duration: 0.3, ease: [0.25, 0.8, 0.25, 1] }}
              className="bg-stone-200 backdrop-blur-md z-50 min-h-[150px] text-sm absolute items-center flex justify-center bottom-10 left-6 md:left-20 min-w-[200px] rounded-[5px] shadow-lg"
            >
              <div className="flex w-full h-full flex-col gap-y-4 p-4">
                <Link
                  href="/cover-letter"
                  className="bg-stone-700 hover:scale-105 transition ease-in rounded-[4px] text-white py-2 px-4 text-center"
                >
                  Cover Letter
                </Link>
                <Link
                  href="/resume-generator"
                  className="bg-stone-800 hover:scale-105 transition ease-in rounded-[4px] text-white py-2 px-4 text-center"
                >
                  Resume
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <MagneticComp>
          <button
            onClick={() => setIsGenerateModalOpen((prev) => !prev)}
            className="flex uppercase gap-x-2 cursor-pointer"
          >
            {isGenerateModalOpen ? "Close" : "Generate"}
          </button>
        </MagneticComp>

        <MagneticComp>
          <Link className="uppercase" href="/jobs">
            Find Jobs
          </Link>
        </MagneticComp>
      </div>
    </div>
  );
}
