import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { Controls, GAME_CONFIG } from '@/lib/constants';
import { useEcoRun } from '@/lib/stores/useEcoRun';

const Player = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetPositionRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.5, 0));

  // Get player state from store
  const playerLane = useEcoRun(state => state.playerLane);
  const isJumping = useEcoRun(state => state.isJumping);
  const jumpHeight = useEcoRun(state => state.jumpHeight);
  const isSliding = useEcoRun(state => state.isSliding);

  // Get player actions
  const moveLeft = useEcoRun(state => state.moveLeft);
  const moveRight = useEcoRun(state => state.moveRight);
  const jump = useEcoRun(state => state.jump);
  const slide = useEcoRun(state => state.slide);
  
  // Get game state
  const gamePhase = useEcoRun(state => state.gamePhase);

  // Subscribe to keyboard controls - no re-renders
  const [, getKeys] = useKeyboardControls<Controls>();

  // Calculate lane position
  const getLanePosition = (lane: number): number => {
    const centerLane = Math.floor(GAME_CONFIG.LANE_COUNT / 2);
    return (lane - centerLane) * GAME_CONFIG.LANE_WIDTH;
  };

  // Handle keyboard input
  useFrame(() => {
    if (gamePhase !== 'playing') return;
    
    const keys = getKeys();
    
    // Movement controls
    if (keys.leftward) {
      moveLeft();
    }
    
    if (keys.rightward) {
      moveRight();
    }
    
    if (keys.jump) {
      jump();
    }
    
    if (keys.backward) {
      slide();
    }
  });

  // Update player position based on lane, jump, slide
  useFrame(() => {
    if (!meshRef.current) return;
    
    // Calculate target position based on lane
    const laneX = getLanePosition(playerLane);
    const baseY = isSliding ? 0.25 : 0.5; // Lower height when sliding
    const jumpY = baseY + jumpHeight;
    
    targetPositionRef.current.set(laneX, jumpY, 0);
    
    // Smoothly move toward target position
    meshRef.current.position.lerp(targetPositionRef.current, 0.2);
    
    // Scale when sliding
    if (isSliding) {
      meshRef.current.scale.set(1, 0.5, 1);
    } else {
      meshRef.current.scale.set(1, 1, 1);
    }
  });

  return (
    <group>
      <mesh 
        ref={meshRef} 
        position={[0, 0.5, 0]}
        castShadow
      >
        <boxGeometry args={[0.8, 1, 0.8]} />
        <meshStandardMaterial color="#4CAF50" /> {/* Green for eco-hero */}
      </mesh>
    </group>
  );
};

export default Player;
