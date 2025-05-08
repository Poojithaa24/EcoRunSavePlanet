import { useRef, useEffect } from 'react';
import { useEcoRun } from '../stores/useEcoRun';
import { GAME_CONFIG } from '../constants';

interface CollidableObject {
  id: string;
  lane: number;
  distance: number;
  type: string;
}

export function useCollision() {
  const playerLane = useEcoRun(state => state.playerLane);
  const isJumping = useEcoRun(state => state.isJumping);
  const jumpHeight = useEcoRun(state => state.jumpHeight);
  const collectTrash = useEcoRun(state => state.collectTrash);
  const hitObstacle = useEcoRun(state => state.hitObstacle);
  const hitHazard = useEcoRun(state => state.hitHazard);
  
  const checkedCollisionsRef = useRef<Set<string>>(new Set());

  // Check if two objects are colliding based on their lanes and distances
  const checkCollision = (
    objectA: { lane: number, distance: number, radius: number },
    objectB: { lane: number, distance: number, radius: number }
  ): boolean => {
    // Lane check first (must be in same lane)
    if (objectA.lane !== objectB.lane) {
      return false;
    }
    
    // Distance check (center-to-center must be less than sum of radii)
    const distanceBetween = Math.abs(objectA.distance - objectB.distance);
    return distanceBetween < (objectA.radius + objectB.radius);
  };

  // Function to check collision with player
  const checkPlayerCollision = (
    object: CollidableObject, 
    playerRadius: number = GAME_CONFIG.PLAYER_RADIUS
  ): boolean => {
    // Don't check if already processed this object
    if (checkedCollisionsRef.current.has(object.id)) {
      return false;
    }
    
    // Skip if object is behind player
    if (object.distance < 0) {
      return false;
    }
    
    // Player is represented by its lane and distance 0
    const player = {
      lane: playerLane,
      distance: 0,
      radius: playerRadius
    };
    
    const objectWithRadius = {
      ...object,
      radius: object.type.includes('obstacle') 
        ? GAME_CONFIG.OBSTACLE_RADIUS 
        : object.type.includes('hazard')
          ? GAME_CONFIG.HAZARD_RADIUS
          : GAME_CONFIG.COLLECTIBLE_RADIUS
    };
    
    // Special case: jumping can avoid obstacles if jump is high enough
    if (isJumping && jumpHeight > GAME_CONFIG.OBSTACLE_RADIUS * 2 && object.type.includes('obstacle')) {
      return false;
    }
    
    const collision = checkCollision(player, objectWithRadius);
    
    if (collision) {
      // Mark as checked so we don't process it again
      checkedCollisionsRef.current.add(object.id);
    }
    
    return collision;
  };
  
  // Reset checked collisions when game restarts
  useEffect(() => {
    const gamePhase = useEcoRun.getState().gamePhase;
    if (gamePhase === 'start_menu') {
      checkedCollisionsRef.current.clear();
    }
  }, [useEcoRun.getState().gamePhase]);

  return {
    checkCollision,
    checkPlayerCollision
  };
}
