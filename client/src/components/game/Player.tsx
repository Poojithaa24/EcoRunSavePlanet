import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Controls, GAME_CONFIG } from '@/lib/constants';
import { useEcoRun } from '@/lib/stores/useEcoRun';

const Player = () => {
  const groupRef = useRef<THREE.Group>(null);
  const targetPositionRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const runningCycle = useRef<number>(0);

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
  const gameSpeed = useEcoRun(state => state.gameSpeed);

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
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Calculate target position based on lane
    const laneX = getLanePosition(playerLane);
    const baseY = isSliding ? 0.1 : 0; // Lower when sliding
    const jumpY = baseY + jumpHeight;
    
    targetPositionRef.current.set(laneX, jumpY, 0);
    
    // Smoothly move toward target position
    groupRef.current.position.lerp(targetPositionRef.current, 0.2);
    
    // Running animation
    if (!isSliding && !isJumping && gamePhase === 'playing') {
      runningCycle.current += delta * 10 * gameSpeed;
      // Up-down bobbing motion for running
      groupRef.current.position.y += Math.sin(runningCycle.current) * 0.03;
      
      // Slight lean forward while running
      groupRef.current.rotation.x = Math.sin(runningCycle.current) * 0.1;
    }
    
    // Scale when sliding
    if (isSliding) {
      groupRef.current.scale.set(1, 0.5, 1);
      groupRef.current.rotation.x = 0.5; // Lean forward when sliding
    } else {
      groupRef.current.scale.set(1, 1, 1);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} castShadow>
      {/* Head */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#FFC107" />
      </mesh>
      
      {/* Body */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 0.6, 16]} />
        <meshStandardMaterial color="#4CAF50" />
      </mesh>
      
      {/* Arms */}
      <mesh position={[0, 1.1, 0.1]} rotation={[0.3, 0, 0.8]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
        <meshStandardMaterial color="#FFC107" />
      </mesh>
      <mesh position={[0, 1.1, 0.1]} rotation={[0.3, 0, -0.8]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
        <meshStandardMaterial color="#FFC107" />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.15, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.6, 16]} />
        <meshStandardMaterial color="#3F51B5" />
      </mesh>
      <mesh position={[0.15, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.6, 16]} />
        <meshStandardMaterial color="#3F51B5" />
      </mesh>
      
      {/* Feet */}
      <mesh position={[-0.15, 0.15, 0.05]} castShadow>
        <boxGeometry args={[0.12, 0.1, 0.25]} />
        <meshStandardMaterial color="#795548" />
      </mesh>
      <mesh position={[0.15, 0.15, 0.05]} castShadow>
        <boxGeometry args={[0.12, 0.1, 0.25]} />
        <meshStandardMaterial color="#795548" />
      </mesh>
    </group>
  );
};

export default Player;
