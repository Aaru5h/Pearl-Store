"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshWobbleMaterial, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

// Mini 3D Component For Cloud
export function Cloud3D() {
    return (
        <Float speed={2.5} rotationIntensity={0.5} floatIntensity={1.5}>
            <group scale={1.2}>
                <mesh position={[-0.4, -0.1, 0]}>
                    <sphereGeometry args={[0.5, 32, 32]} />
                    <MeshWobbleMaterial color="#fdfbf7" factor={0.2} speed={1} roughness={0.4} />
                </mesh>
                <mesh position={[0.4, -0.1, 0]}>
                    <sphereGeometry args={[0.45, 32, 32]} />
                    <MeshWobbleMaterial color="#fdfbf7" factor={0.2} speed={1.2} roughness={0.4} />
                </mesh>
                <mesh position={[0, 0.3, 0]}>
                    <sphereGeometry args={[0.55, 32, 32]} />
                    <MeshWobbleMaterial color="#fdfbf7" factor={0.3} speed={0.9} roughness={0.4} />
                </mesh>
            </group>
        </Float>
    );
}

// Mini 3D Component For Matcha Mug
export function Mug3D() {
    const groupRef = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
            <group ref={groupRef} scale={1.3} rotation={[Math.PI / 8, 0, 0]}>
                {/* Body */}
                <mesh position={[0, 0, 0]}>
                    <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
                    <meshStandardMaterial color="#b2c9ab" roughness={0.2} />
                </mesh>
                {/* Handle */}
                <mesh position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <torusGeometry args={[0.3, 0.08, 16, 32, Math.PI]} />
                    <meshStandardMaterial color="#b2c9ab" roughness={0.2} />
                </mesh>
            </group>
        </Float>
    );
}

// Mini 3D Component For Fairy Lights
export function Lights3D() {
    const lightsRef = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (lightsRef.current) {
            lightsRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
            lightsRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
        }
    });

    const lights = useMemo(() => {
        return Array.from({ length: 5 }).map((_, i) => ({
            position: [
                (Math.random() - 0.5) * 1.5,
                (Math.random() - 0.5) * 1.5,
                (Math.random() - 0.5) * 1.5,
            ] as [number, number, number],
            scale: Math.random() * 0.3 + 0.2
        }));
    }, []);

    return (
        <group ref={lightsRef}>
            {lights.map((l, i) => (
                <Float key={i} speed={3} rotationIntensity={2} floatIntensity={2}>
                    <mesh position={l.position} scale={l.scale}>
                        <octahedronGeometry args={[1, 0]} />
                        <meshStandardMaterial color="#f2a68d" emissive="#f2a68d" emissiveIntensity={0.5} />
                    </mesh>
                </Float>
            ))}
        </group>
    );
}

// Mini 3D Component For Diffuser
export function Diffuser3D() {
    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
            <group scale={1.3} rotation={[Math.PI / 10, -Math.PI / 6, 0]}>
                {/* Bottle */}
                <mesh position={[0, -0.3, 0]}>
                    <capsuleGeometry args={[0.4, 0.5, 32, 32]} />
                    <meshPhysicalMaterial color="#dfd8ce" transmission={0.9} roughness={0.1} ior={1.5} />
                </mesh>
                {/* Sticks */}
                <mesh position={[0.1, 0.6, 0.1]} rotation={[0, 0, -0.2]}>
                    <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
                    <meshStandardMaterial color="#d0bba6" />
                </mesh>
                <mesh position={[-0.1, 0.65, -0.05]} rotation={[0, 0, 0.15]}>
                    <cylinderGeometry args={[0.02, 0.02, 1.1, 8]} />
                    <meshStandardMaterial color="#d0bba6" />
                </mesh>
                <mesh position={[0, 0.55, 0.15]} rotation={[0.2, 0, 0]}>
                    <cylinderGeometry args={[0.02, 0.02, 0.9, 8]} />
                    <meshStandardMaterial color="#d0bba6" />
                </mesh>
            </group>
        </Float>
    );
}

// Mini 3D Component For Bento Organizer
export function Bento3D() {
    const boxRef = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (boxRef.current) {
            boxRef.current.rotation.y = Math.sin(state.clock.getElapsedTime()) * 0.2 + Math.PI / 4;
            boxRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.1 + 0.2;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={1}>
            <group ref={boxRef} scale={1.2}>
                <RoundedBox args={[1.2, 0.4, 0.8]} radius={0.1} smoothness={4} position={[0, -0.25, 0]}>
                    <meshStandardMaterial color="#fdfbf7" roughness={0.3} />
                </RoundedBox>
                <RoundedBox args={[0.55, 0.3, 0.7]} radius={0.08} smoothness={4} position={[-0.28, 0.15, 0]}>
                    <meshStandardMaterial color="#e88d6f" roughness={0.3} />
                </RoundedBox>
                <RoundedBox args={[0.55, 0.3, 0.7]} radius={0.08} smoothness={4} position={[0.28, 0.15, 0]}>
                    <meshStandardMaterial color="#b2c9ab" roughness={0.3} />
                </RoundedBox>
            </group>
        </Float>
    );
}

// Map scenes to product IDs
const scenes: Record<number, React.FC> = {
    1: Cloud3D,
    2: Mug3D,
    3: Lights3D,
    4: Diffuser3D,
    5: Bento3D,
};

export default function FeaturedProductCanvas({ productId }: { productId: number }) {
    const Scene = scenes[productId];
    if (!Scene) return null;

    return (
        <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} intensity={1.5} color="#fdfbf7" />
            <directionalLight position={[-5, -5, -5]} intensity={0.8} color="#f2a68d" />
            <Scene />
        </Canvas>
    );
}
