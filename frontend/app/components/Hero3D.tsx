"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, MeshWobbleMaterial, Sparkles, ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";

function InteractiveBlob() {
    const meshRef = useRef<THREE.Mesh>(null);
    
    // Add subtle floating interactions
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, (state.pointer.y * Math.PI) / 4, 0.05);
            meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, (state.pointer.x * Math.PI) / 4, 0.05);
        }
    });

    return (
        <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
            <mesh ref={meshRef} position={[0, 0, 0]}>
                <sphereGeometry args={[1.6, 64, 64]} />
                <MeshDistortMaterial 
                    color="#f2a68d" 
                    envMapIntensity={0.8} 
                    clearcoat={0.8} 
                    clearcoatRoughness={0.1}
                    metalness={0.1}
                    roughness={0.2}
                    distort={0.4} 
                    speed={2} 
                />
            </mesh>
        </Float>
    );
}

export default function Hero3D() {
    return (
        <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
            {/* Soft lighting setup for warm aesthetic */}
            <ambientLight intensity={0.6} color="#fdfbf7" />
            <directionalLight position={[10, 10, 5]} intensity={1.5} color="#fdfbf7" castShadow />
            <directionalLight position={[-10, -10, -5]} intensity={1} color="#e88d6f" />
            
            <Environment preset="city" />

            {/* Main Interactive Blob */}
            <InteractiveBlob />

            {/* Matcha Green Floating Ring */}
            <Float speed={2.5} rotationIntensity={2} floatIntensity={1.5}>
                <mesh position={[2.2, -1.2, 1]}>
                    <torusGeometry args={[0.7, 0.25, 32, 64]} />
                    <MeshWobbleMaterial color="#b2c9ab" factor={0.5} speed={2} roughness={0.1} metalness={0.1} />
                </mesh>
            </Float>

            {/* Cream Soft Pill */}
            <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
                <mesh position={[-2.5, 1.5, 0.5]} rotation={[0, 0, Math.PI / 4]}>
                    <capsuleGeometry args={[0.4, 0.8, 32, 32]} />
                    <meshStandardMaterial color="#fdfbf7" roughness={0.1} metalness={0.1} />
                </mesh>
            </Float>

            {/* Little Terracotta Sphere */}
            <Float speed={3} rotationIntensity={1.5} floatIntensity={1}>
                <mesh position={[1.5, 2.2, -1]}>
                    <sphereGeometry args={[0.3, 32, 32]} />
                    <meshStandardMaterial color="#e88d6f" roughness={0.2} />
                </mesh>
            </Float>
            
            {/* Soft comforting sparkles */}
            <Sparkles count={60} scale={7} size={3} speed={0.3} opacity={0.4} color="#f2a68d" />
            <Sparkles count={40} scale={7} size={2} speed={0.5} opacity={0.3} color="#b2c9ab" />

            {/* Ground shadow for depth and anchoring */}
            <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} color="#4a3b32" />
        </Canvas>
    );
}
