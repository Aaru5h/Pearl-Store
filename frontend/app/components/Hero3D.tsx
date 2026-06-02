"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";

function PearlSphere() {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);

    useFrame((state) => {
        if (meshRef.current) {
            // Smooth pointer-tracking rotation
            meshRef.current.rotation.x = THREE.MathUtils.lerp(
                meshRef.current.rotation.x,
                (state.pointer.y * Math.PI) / 6,
                0.03
            );
            meshRef.current.rotation.y = THREE.MathUtils.lerp(
                meshRef.current.rotation.y,
                (state.pointer.x * Math.PI) / 4,
                0.03
            );
        }
    });

    return (
        <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.8}>
            <mesh ref={meshRef} scale={2.2}>
                <sphereGeometry args={[1, 128, 128]} />
                <meshPhysicalMaterial
                    ref={materialRef}
                    color="#e8e0d8"
                    metalness={0.1}
                    roughness={0.15}
                    clearcoat={1}
                    clearcoatRoughness={0.05}
                    envMapIntensity={1.5}
                    iridescence={1}
                    iridescenceIOR={1.3}
                    iridescenceThicknessRange={[100, 400]}
                    sheen={0.5}
                    sheenRoughness={0.3}
                    sheenColor={new THREE.Color("#c4b5fd")}
                />
            </mesh>
        </Float>
    );
}

function FloatingRing({ position, rotation, color, scale = 1 }: {
    position: [number, number, number];
    rotation: [number, number, number];
    color: string;
    scale?: number;
}) {
    const ref = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.z += 0.003;
            ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
        }
    });

    return (
        <mesh ref={ref} position={position} rotation={rotation} scale={scale}>
            <torusGeometry args={[0.8, 0.02, 32, 128]} />
            <meshPhysicalMaterial
                color={color}
                metalness={0.8}
                roughness={0.1}
                clearcoat={1}
                transparent
                opacity={0.4}
            />
        </mesh>
    );
}

export default function Hero3D() {
    return (
        <Canvas
            camera={{ position: [0, 0, 8], fov: 40 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: 'transparent' }}
        >
            {/* Dramatic lighting */}
            <ambientLight intensity={0.2} color="#e8e4df" />
            <directionalLight position={[10, 8, 5]} intensity={2} color="#fff5ee" />
            <directionalLight position={[-5, -5, -5]} intensity={0.8} color="#c4b5fd" />
            <pointLight position={[3, 3, 3]} intensity={1} color="#93c5fd" distance={15} />
            <pointLight position={[-3, -2, 2]} intensity={0.5} color="#c4b5fd" distance={12} />

            <Environment preset="night" />

            {/* Main Pearl */}
            <PearlSphere />

            {/* Ethereal floating rings */}
            <FloatingRing position={[3, 1, -2]} rotation={[Math.PI / 3, 0, 0]} color="#c4b5fd" scale={1.2} />
            <FloatingRing position={[-2.5, -1.5, -1]} rotation={[Math.PI / 4, Math.PI / 6, 0]} color="#93c5fd" scale={0.8} />
            <FloatingRing position={[0, 2.5, -3]} rotation={[Math.PI / 2, 0, Math.PI / 4]} color="#e0d4fa" scale={1.5} />

            {/* Atmospheric particles */}
            <Sparkles count={80} scale={12} size={1.5} speed={0.2} opacity={0.3} color="#c4b5fd" />
            <Sparkles count={40} scale={10} size={1} speed={0.3} opacity={0.2} color="#93c5fd" />

            {/* Ground shadow */}
            <ContactShadows position={[0, -3.5, 0]} opacity={0.3} scale={12} blur={3} far={6} color="#000" />
        </Canvas>
    );
}
