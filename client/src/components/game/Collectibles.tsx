import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEcoRun } from '@/lib/stores/useEcoRun';
import { GAME_CONFIG, TrashType } from '@/lib/constants';
import { useCollision } from '@/lib/hooks/useCollision';

// Map of trash types to colors for visualization
const trashColors = {
  [TrashType.PLASTIC]: "#2196F3", // Blue for plastic
  [TrashType.PAPER]: "#FFC107",   // Yellow for paper
  [TrashType.METAL]: "#9E9E9E",   // Grey for metal
};

const Collectibles = () => {
  const collectibles = useEcoRun(state => state.collectibles);
  const gamePhase = useEcoRun(state => state.gamePhase);
  const collectTrash = useEcoRun(state => state.collectTrash);
  
  const { checkPlayerCollision } = useCollision();
  const collectibleRefs = useRef<{ [key: string]: THREE.Mesh }>({});
  
  // Continuously rotate the collectibles
  useFrame((state, delta) => {
    Object.values(collectibleRefs.current).forEach(mesh => {
      if (mesh) {
        mesh.rotation.y += delta * 2;
      }
    });
    
    // Check for collisions with player
    if (gamePhase === 'playing') {
      collectibles.forEach(collectible => {
        if (checkPlayerCollision(collectible)) {
          console.log('Collected trash:', collectible.type);
          collectTrash(collectible.type as TrashType);
        }
      });
    }
  });

  // Helper function to calculate lane position
  const getLanePosition = (lane: number): number => {
    const centerLane = Math.floor(GAME_CONFIG.LANE_COUNT / 2);
    return (lane - centerLane) * GAME_CONFIG.LANE_WIDTH;
  };

  return (
    <group>
      {collectibles.map(collectible => {
        const x = getLanePosition(collectible.lane);
        const z = collectible.distance;
        const type = collectible.type as TrashType;
        
        // Display different shapes based on trash type
        let geometry;
        if (type === TrashType.PLASTIC) {
          // Plastic bottle shape
          geometry = <cylinderGeometry args={[0.2, 0.3, 0.8, 8]} />;
        } else if (type === TrashType.PAPER) {
          // Paper shape - flattened box
          geometry = <boxGeometry args={[0.6, 0.1, 0.8]} />;
        } else {
          // Metal can shape
          geometry = <cylinderGeometry args={[0.25, 0.25, 0.7, 16]} />;
        }
        
        return (
          <mesh
            key={collectible.id}
            ref={el => {
              if (el) collectibleRefs.current[collectible.id] = el;
            }}
            position={[x, 0.5, z]}
            castShadow
          >
            {geometry}
            <meshStandardMaterial 
              color={trashColors[type]} 
              metalness={type === TrashType.METAL ? 0.8 : 0}
              roughness={type === TrashType.METAL ? 0.2 : 0.8}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export default Collectibles;
