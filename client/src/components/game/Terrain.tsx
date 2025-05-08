import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useEcoRun } from '@/lib/stores/useEcoRun';
import { GAME_CONFIG } from '@/lib/constants';

const Terrain = () => {
  const { gameSpeed } = useEcoRun();
  const groundRef = useRef<THREE.Mesh>(null);
  const textureRef = useRef<THREE.Texture | null>(null);
  
  // Load grass texture for the ground
  const grassTexture = useTexture('/textures/grass.png');
  
  // Set texture properties
  useMemo(() => {
    if (grassTexture) {
      grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
      grassTexture.repeat.set(20, 100);
      textureRef.current = grassTexture;
    }
  }, [grassTexture]);

  // Scroll the texture to create movement illusion
  useFrame((state, delta) => {
    if (textureRef.current && groundRef.current) {
      // Scroll texture based on game speed
      textureRef.current.offset.y -= gameSpeed * delta;
    }
  });

  const { viewport } = useThree();
  
  // Calculate the width of the ground based on the number of lanes
  const groundWidth = GAME_CONFIG.LANE_WIDTH * GAME_CONFIG.LANE_COUNT + 4; // Add some padding

  return (
    <group>
      {/* Main ground */}
      <mesh 
        ref={groundRef}
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]} 
        receiveShadow
      >
        <planeGeometry args={[groundWidth, 100]} />
        <meshStandardMaterial 
          map={grassTexture}
          color="#8BC34A"
        />
      </mesh>
      
      {/* Side terrain (left) */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[-groundWidth, 0, 0]} 
        receiveShadow
      >
        <planeGeometry args={[groundWidth * 2, 100]} />
        <meshStandardMaterial 
          color="#689F38"
        />
      </mesh>
      
      {/* Side terrain (right) */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[groundWidth, 0, 0]} 
        receiveShadow
      >
        <planeGeometry args={[groundWidth * 2, 100]} />
        <meshStandardMaterial 
          color="#689F38"
        />
      </mesh>
      
      {/* Lane dividers */}
      {Array(GAME_CONFIG.LANE_COUNT - 1).fill(0).map((_, i) => {
        const x = getLanePosition(i + 0.5);
        return (
          <mesh
            key={`divider-${i}`}
            rotation={[-Math.PI / 2, 0, 0]} 
            position={[x, 0.01, 0]} 
          >
            <planeGeometry args={[0.1, 100]} />
            <meshStandardMaterial 
              color="#FFFFFF"
              transparent
              opacity={0.5}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// Helper function to calculate lane position
const getLanePosition = (lane: number): number => {
  const centerLane = Math.floor(GAME_CONFIG.LANE_COUNT / 2);
  return (lane - centerLane) * GAME_CONFIG.LANE_WIDTH;
};

export default Terrain;
