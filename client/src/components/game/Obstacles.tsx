import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEcoRun } from '@/lib/stores/useEcoRun';
import { GAME_CONFIG } from '@/lib/constants';
import { useCollision } from '@/lib/hooks/useCollision';

const Obstacles = () => {
  const obstacles = useEcoRun(state => state.obstacles);
  const gamePhase = useEcoRun(state => state.gamePhase);
  const hitObstacle = useEcoRun(state => state.hitObstacle);
  
  const { checkPlayerCollision } = useCollision();
  const obstacleRefs = useRef<{ [key: string]: THREE.Mesh }>({});
  
  // Check for collisions with player
  useFrame(() => {
    if (gamePhase !== 'playing') return;
    
    obstacles.forEach(obstacle => {
      if (checkPlayerCollision(obstacle)) {
        console.log('Collision with obstacle:', obstacle.id);
        hitObstacle();
      }
    });
  });

  // Helper function to calculate lane position
  const getLanePosition = (lane: number): number => {
    const centerLane = Math.floor(GAME_CONFIG.LANE_COUNT / 2);
    return (lane - centerLane) * GAME_CONFIG.LANE_WIDTH;
  };

  return (
    <group>
      {obstacles.map(obstacle => {
        const x = getLanePosition(obstacle.lane);
        const z = obstacle.distance;
        
        // Determine obstacle appearance based on type
        const color = obstacle.type === 'rock' ? "#555555" : "#8B4513"; // Grey for rock, brown for log
        const size = obstacle.type === 'rock' 
          ? [1, 0.8, 1] // Rock dimensions
          : [1.5, 0.5, 0.5]; // Log dimensions
        
        return (
          <mesh
            key={obstacle.id}
            ref={el => {
              if (el) obstacleRefs.current[obstacle.id] = el;
            }}
            position={[x, size[1] / 2, z]}
            castShadow
            receiveShadow
          >
            {obstacle.type === 'rock' ? (
              <boxGeometry args={size} />
            ) : (
              <cylinderGeometry args={[size[1]/2, size[1]/2, size[0], 8]} rotation={[0, 0, Math.PI/2]} />
            )}
            <meshStandardMaterial color={color} />
          </mesh>
        );
      })}
    </group>
  );
};

export default Obstacles;
