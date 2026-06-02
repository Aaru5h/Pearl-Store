"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshWobbleMaterial, RoundedBox, Environment } from "@react-three/drei";
import * as THREE from "three";

// ──── Cloud Cushion: Ethereal glowing cloud ────
export function Cloud3D() {
    return (
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1}>
            <group scale={1.4}>
                <mesh position={[-0.4, -0.1, 0]}>
                    <sphereGeometry args={[0.5, 32, 32]} />
                    <meshPhysicalMaterial color="#d4d0cc" roughness={0.3} clearcoat={0.5} envMapIntensity={0.8} />
                </mesh>
                <mesh position={[0.4, -0.1, 0]}>
                    <sphereGeometry args={[0.45, 32, 32]} />
                    <meshPhysicalMaterial color="#d4d0cc" roughness={0.3} clearcoat={0.5} envMapIntensity={0.8} />
                </mesh>
                <mesh position={[0, 0.3, 0]}>
                    <sphereGeometry args={[0.55, 32, 32]} />
                    <meshPhysicalMaterial color="#e0dcd8" roughness={0.2} clearcoat={0.8} envMapIntensity={1} />
                </mesh>
            </group>
        </Float>
    );
}

// ──── Matcha Mug: Sleek dark ceramic ────
export function Mug3D() {
    const groupRef = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
        }
    });

    return (
        <Float speed={1} rotationIntensity={0.3} floatIntensity={0.8}>
            <group ref={groupRef} scale={1.4} rotation={[Math.PI / 10, 0, 0]}>
                <mesh position={[0, 0, 0]}>
                    <cylinderGeometry args={[0.5, 0.45, 1, 32]} />
                    <meshPhysicalMaterial color="#2a2a2f" roughness={0.15} metalness={0.05} clearcoat={1} />
                </mesh>
                <mesh position={[0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <torusGeometry args={[0.28, 0.06, 16, 32, Math.PI]} />
                    <meshPhysicalMaterial color="#2a2a2f" roughness={0.15} metalness={0.05} clearcoat={1} />
                </mesh>
            </group>
        </Float>
    );
}

// ──── Fairy Lights: Glowing orbs ────
export function Lights3D() {
    const groupRef = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
        }
    });

    const lights = useMemo(() => {
        return Array.from({ length: 7 }).map((_, i) => ({
            position: [
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
            ] as [number, number, number],
            scale: Math.random() * 0.15 + 0.08,
            color: i % 2 === 0 ? "#c4b5fd" : "#fbbf24"
        }));
    }, []);

    return (
        <group ref={groupRef}>
            {lights.map((l, i) => (
                <Float key={i} speed={2 + i * 0.3} rotationIntensity={1} floatIntensity={1.5}>
                    <mesh position={l.position} scale={l.scale}>
                        <sphereGeometry args={[1, 16, 16]} />
                        <meshStandardMaterial
                            color={l.color}
                            emissive={l.color}
                            emissiveIntensity={2}
                            toneMapped={false}
                        />
                    </mesh>
                </Float>
            ))}
            {/* Wire connecting lights */}
            <mesh>
                <torusGeometry args={[1.2, 0.008, 8, 64]} />
                <meshStandardMaterial color="#3a3a3f" />
            </mesh>
        </group>
    );
}

// ──── Diffuser: Glass bottle with sticks ────
export function Diffuser3D() {
    return (
        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.8}>
            <group scale={1.4} rotation={[Math.PI / 12, -Math.PI / 8, 0]}>
                <mesh position={[0, -0.3, 0]}>
                    <capsuleGeometry args={[0.35, 0.5, 32, 32]} />
                    <meshPhysicalMaterial
                        color="#1a1a20"
                        transmission={0.9}
                        roughness={0.05}
                        ior={1.5}
                        thickness={0.5}
                        clearcoat={1}
                        envMapIntensity={1.5}
                    />
                </mesh>
                {[0.1, -0.08, 0.04].map((xOff, i) => (
                    <mesh
                        key={i}
                        position={[xOff, 0.6 + i * 0.05, (i - 1) * 0.08]}
                        rotation={[0, 0, (i - 1) * 0.15]}
                    >
                        <cylinderGeometry args={[0.015, 0.015, 1 + i * 0.1, 8]} />
                        <meshStandardMaterial color="#8a8580" roughness={0.8} />
                    </mesh>
                ))}
            </group>
        </Float>
    );
}

// ──── Bento Organizer: Minimal dark boxes ────
export function Bento3D() {
    const boxRef = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (boxRef.current) {
            boxRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.3 + Math.PI / 4;
            boxRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1 + 0.2;
        }
    });

    return (
        <Float speed={1} rotationIntensity={0.1} floatIntensity={0.6}>
            <group ref={boxRef} scale={1.3}>
                <RoundedBox args={[1.2, 0.35, 0.8]} radius={0.06} smoothness={4} position={[0, -0.22, 0]}>
                    <meshPhysicalMaterial color="#1e1e24" roughness={0.2} clearcoat={0.5} />
                </RoundedBox>
                <RoundedBox args={[0.55, 0.28, 0.7]} radius={0.05} smoothness={4} position={[-0.28, 0.12, 0]}>
                    <meshPhysicalMaterial color="#2a2a35" roughness={0.2} clearcoat={0.8} />
                </RoundedBox>
                <RoundedBox args={[0.55, 0.28, 0.7]} radius={0.05} smoothness={4} position={[0.28, 0.12, 0]}>
                    <meshPhysicalMaterial color="#c4b5fd" roughness={0.25} clearcoat={0.8} metalness={0.1} />
                </RoundedBox>
            </group>
        </Float>
    );
}

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
        <Canvas
            camera={{ position: [0, 0, 4], fov: 45 }}
            gl={{ antialias: true }}
        >
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 5, 5]} intensity={1.5} color="#fff5ee" />
            <directionalLight position={[-5, -3, -5]} intensity={0.6} color="#c4b5fd" />
            <pointLight position={[2, 2, 2]} intensity={0.5} color="#93c5fd" distance={10} />
            <Environment preset="night" />
            <Scene />
        </Canvas>
    );
}
