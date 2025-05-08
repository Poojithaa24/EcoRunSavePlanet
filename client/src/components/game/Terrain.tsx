import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture, Cloud } from '@react-three/drei';
import * as THREE from 'three';
import { useEcoRun } from '@/lib/stores/useEcoRun';
import { GAME_CONFIG } from '@/lib/constants';

const Terrain = () => {
  const { gameSpeed } = useEcoRun();
  const groundRef = useRef<THREE.Mesh>(null);
  const textureRef = useRef<THREE.Texture | null>(null);
  const roadRef = useRef<THREE.Mesh>(null);
  const asphaltTextureRef = useRef<THREE.Texture | null>(null);
  
  // Load textures
  const grassTexture = useTexture('/textures/grass.png');
  const asphaltTexture = useTexture('/textures/asphalt.png');
  const skyTexture = useTexture('/textures/sky.png');
  
  // Set grass texture properties
  useMemo(() => {
    if (grassTexture) {
      grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
      grassTexture.repeat.set(20, 100);
      textureRef.current = grassTexture;
    }
  }, [grassTexture]);
  
  // Set asphalt texture properties
  useMemo(() => {
    if (asphaltTexture) {
      asphaltTexture.wrapS = asphaltTexture.wrapT = THREE.RepeatWrapping;
      asphaltTexture.repeat.set(2, 100);
      asphaltTextureRef.current = asphaltTexture;
    }
  }, [asphaltTexture]);

  // Scroll the textures to create movement illusion
  useFrame((state, delta) => {
    if (textureRef.current && groundRef.current) {
      // Scroll texture based on game speed
      textureRef.current.offset.y -= gameSpeed * delta;
    }
    
    if (asphaltTextureRef.current && roadRef.current) {
      // Scroll texture based on game speed
      asphaltTextureRef.current.offset.y -= gameSpeed * delta * 2;
    }
  });

  const { viewport } = useThree();
  
  // Calculate the width of the ground based on the number of lanes
  const groundWidth = GAME_CONFIG.LANE_WIDTH * GAME_CONFIG.LANE_COUNT + 8; // Add some padding
  const roadWidth = GAME_CONFIG.LANE_WIDTH * GAME_CONFIG.LANE_COUNT + 2;

  // Create trees randomly
  const trees = useMemo(() => {
    const result = [];
    const treeCount = 20;
    
    for (let i = 0; i < treeCount; i++) {
      // Position trees on both sides of the road
      const side = Math.random() > 0.5 ? 1 : -1;
      const x = side * (roadWidth / 2 + 1 + Math.random() * 5);
      const z = -10 - Math.random() * 80; // Different distances ahead
      
      result.push({ position: [x, 0, z], scale: 0.5 + Math.random() * 1 });
    }
    
    return result;
  }, [roadWidth]);

  return (
    <group>
      {/* Skybox */}
      <mesh position={[0, 0, -50]} rotation={[0, 0, 0]}>
        <planeGeometry args={[100, 50]} />
        <meshBasicMaterial map={skyTexture} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Clouds */}
      <Cloud position={[-10, 15, -30]} speed={0.2} opacity={0.7} />
      <Cloud position={[10, 12, -20]} speed={0.1} opacity={0.6} />
      <Cloud position={[0, 10, -40]} speed={0.3} opacity={0.8} />
      
      {/* Main ground (grass) */}
      <mesh 
        ref={groundRef}
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.1, 0]} 
        receiveShadow
      >
        <planeGeometry args={[groundWidth * 3, 100]} />
        <meshStandardMaterial 
          map={grassTexture}
          color="#8BC34A"
        />
      </mesh>
      
      {/* Road (asphalt) */}
      <mesh 
        ref={roadRef}
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]} 
        receiveShadow
      >
        <planeGeometry args={[roadWidth, 100]} />
        <meshStandardMaterial 
          map={asphaltTexture}
          color="#555555"
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
              opacity={0.8}
            />
          </mesh>
        );
      })}
      
      {/* Trees */}
      {trees.map((tree, index) => (
        <group key={`tree-${index}`} position={[tree.position[0], 0, tree.position[2]]} scale={tree.scale}>
          {/* Tree trunk */}
          <mesh position={[0, 0.8, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.3, 1.6, 8]} />
            <meshStandardMaterial color="#795548" />
          </mesh>
          
          {/* Tree foliage */}
          <mesh position={[0, 2, 0]} castShadow>
            <coneGeometry args={[1.5, 3, 8]} />
            <meshStandardMaterial color="#2E7D32" />
          </mesh>
        </group>
      ))}
      
      {/* Road sides */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0.02, 0]} 
        receiveShadow
      >
        <ringGeometry args={[roadWidth/2, roadWidth/2 + 0.3, 32, 1, 0, Math.PI * 2]} />
        <meshStandardMaterial color="#FFC107" />
      </mesh>
    </group>
  );
};

// Helper function to calculate lane position
const getLanePosition = (lane: number): number => {
  const centerLane = Math.floor(GAME_CONFIG.LANE_COUNT / 2);
  return (lane - centerLane) * GAME_CONFIG.LANE_WIDTH;
};

export default Terrain;
