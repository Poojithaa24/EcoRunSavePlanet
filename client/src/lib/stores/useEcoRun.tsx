import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { GamePhase, TrashType, UpgradeType, HazardType, POINTS, GAME_CONFIG } from "../constants";
import { useAudio } from "./useAudio";

interface TrashInventory {
  [TrashType.PLASTIC]: number;
  [TrashType.PAPER]: number;
  [TrashType.METAL]: number;
}

interface Upgrades {
  [UpgradeType.TREE]: number;
  [UpgradeType.SOLAR_PANEL]: number;
  [UpgradeType.RECYCLING_CENTER]: number;
}

interface EcoRunState {
  // Game state
  gamePhase: string;
  score: number;
  distance: number;
  ecoLevel: number;
  gameSpeed: number;
  lastObstacleTime: number;
  lastCollectibleTime: number;
  
  // Player state
  playerLane: number;
  isJumping: boolean;
  jumpHeight: number;
  isSliding: boolean;
  
  // Inventory and upgrades
  inventory: TrashInventory;
  upgrades: Upgrades;
  
  // Tutorial
  tutorialComplete: boolean;
  showEcoFact: boolean;
  currentFactId: number | null;

  // Game objects
  obstacles: any[];
  collectibles: any[];
  hazards: any[];
  
  // Actions
  startGame: () => void;
  startTutorial: () => void;
  endTutorial: () => void;
  gameOver: () => void;
  restartGame: () => void;
  
  moveLeft: () => void;
  moveRight: () => void;
  jump: () => void;
  slide: () => void;
  
  updateGameState: (deltaTime: number) => void;
  collectTrash: (type: TrashType) => void;
  hitObstacle: () => void;
  hitHazard: (type: HazardType) => void;
  
  showUpgradeMenu: () => void;
  hideUpgradeMenu: () => void;
  purchaseUpgrade: (type: UpgradeType) => boolean;
  
  showFact: (factId: number) => void;
  hideFact: () => void;
}

export const useEcoRun = create<EcoRunState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    gamePhase: GamePhase.START_MENU,
    score: 0,
    distance: 0,
    ecoLevel: GAME_CONFIG.INITIAL_ECO_LEVEL,
    gameSpeed: GAME_CONFIG.BASE_SCROLL_SPEED,
    lastObstacleTime: 0,
    lastCollectibleTime: 0,

    playerLane: 1, // Center lane (0-left, 1-center, 2-right)
    isJumping: false,
    jumpHeight: 0,
    isSliding: false,

    inventory: {
      [TrashType.PLASTIC]: 0,
      [TrashType.PAPER]: 0,
      [TrashType.METAL]: 0,
    },
    upgrades: {
      [UpgradeType.TREE]: 0,
      [UpgradeType.SOLAR_PANEL]: 0,
      [UpgradeType.RECYCLING_CENTER]: 0,
    },

    tutorialComplete: false,
    showEcoFact: false,
    currentFactId: null,

    obstacles: [],
    collectibles: [],
    hazards: [],

    // Actions
    startGame: () => {
      const { tutorialComplete } = get();
      
      if (!tutorialComplete) {
        set({ gamePhase: GamePhase.TUTORIAL });
      } else {
        // Reset game state
        set({
          gamePhase: GamePhase.PLAYING,
          score: 0,
          distance: 0,
          ecoLevel: GAME_CONFIG.INITIAL_ECO_LEVEL,
          gameSpeed: GAME_CONFIG.BASE_SCROLL_SPEED,
          playerLane: 1,
          isJumping: false,
          jumpHeight: 0,
          isSliding: false,
          obstacles: [],
          collectibles: [],
          hazards: [],
          inventory: {
            [TrashType.PLASTIC]: 0,
            [TrashType.PAPER]: 0,
            [TrashType.METAL]: 0,
          },
        });
        
        // Start background music
        const audioStore = useAudio.getState();
        if (audioStore.backgroundMusic && !audioStore.isMuted) {
          audioStore.backgroundMusic.play().catch(e => console.log("Failed to play background music:", e));
        }
      }
    },

    startTutorial: () => {
      set({ gamePhase: GamePhase.TUTORIAL });
    },

    endTutorial: () => {
      set({ 
        tutorialComplete: true,
        gamePhase: GamePhase.PLAYING,
        // Reset game state
        score: 0,
        distance: 0,
        ecoLevel: GAME_CONFIG.INITIAL_ECO_LEVEL,
        gameSpeed: GAME_CONFIG.BASE_SCROLL_SPEED,
        playerLane: 1,
        isJumping: false,
        jumpHeight: 0,
        isSliding: false,
        obstacles: [],
        collectibles: [],
        hazards: []
      });
      
      // Start background music
      const audioStore = useAudio.getState();
      if (audioStore.backgroundMusic && !audioStore.isMuted) {
        audioStore.backgroundMusic.play().catch(e => console.log("Failed to play background music:", e));
      }
    },

    gameOver: () => {
      set({ gamePhase: GamePhase.GAME_OVER });
      
      // Stop background music
      const audioStore = useAudio.getState();
      if (audioStore.backgroundMusic) {
        audioStore.backgroundMusic.pause();
        audioStore.backgroundMusic.currentTime = 0;
      }
      
      // Play hit sound
      if (!audioStore.isMuted) {
        audioStore.playHit();
      }
    },

    restartGame: () => {
      set({ gamePhase: GamePhase.START_MENU });
    },

    moveLeft: () => {
      const { playerLane } = get();
      if (playerLane > 0) {
        set({ playerLane: playerLane - 1 });
      }
    },

    moveRight: () => {
      const { playerLane } = get();
      if (playerLane < GAME_CONFIG.LANE_COUNT - 1) {
        set({ playerLane: playerLane + 1 });
      }
    },

    jump: () => {
      const { isJumping } = get();
      if (!isJumping) {
        set({ isJumping: true, jumpHeight: 0 });
      }
    },

    slide: () => {
      const { isSliding } = get();
      if (!isSliding) {
        set({ isSliding: true });
        
        // Auto-reset sliding after a delay
        setTimeout(() => {
          set({ isSliding: false });
        }, 1000);
      }
    },

    updateGameState: (deltaTime) => {
      const {
        gamePhase,
        isJumping,
        jumpHeight,
        distance,
        gameSpeed,
        ecoLevel,
        lastObstacleTime,
        lastCollectibleTime,
        obstacles,
        collectibles,
        hazards
      } = get();

      if (gamePhase !== GamePhase.PLAYING) return;

      // Update game speed based on distance
      const newGameSpeed = Math.min(
        GAME_CONFIG.BASE_SCROLL_SPEED + (distance * GAME_CONFIG.SPEED_INCREASE_RATE),
        GAME_CONFIG.MAX_SCROLL_SPEED
      );

      // Update jump mechanics
      let newJumpHeight = jumpHeight;
      let stillJumping = isJumping;

      if (isJumping) {
        if (jumpHeight < GAME_CONFIG.JUMP_FORCE) {
          // Going up
          newJumpHeight += (GAME_CONFIG.JUMP_FORCE - jumpHeight) * 0.2;
        } else {
          // Start falling
          newJumpHeight += GAME_CONFIG.GRAVITY * -1;
        }

        // Check if landing
        if (newJumpHeight <= 0) {
          newJumpHeight = 0;
          stillJumping = false;
        }
      }

      // Spawn new obstacles
      const currentTime = Date.now();
      let newObstacles = [...obstacles];
      let newCollectibles = [...collectibles];
      let newHazards = [...hazards];

      // Maybe spawn obstacle
      if (currentTime - lastObstacleTime > GAME_CONFIG.OBSTACLE_SPAWN_RATE * 1000) {
        const lane = Math.floor(Math.random() * GAME_CONFIG.LANE_COUNT);
        const newObstacle = {
          id: `obstacle-${Date.now()}`,
          lane,
          distance: GAME_CONFIG.SPAWN_DISTANCE,
          type: Math.random() > 0.5 ? 'rock' : 'log'
        };
        
        newObstacles.push(newObstacle);
        set({ lastObstacleTime: currentTime });
      }

      // Maybe spawn collectible (trash)
      if (currentTime - lastCollectibleTime > GAME_CONFIG.COLLECTIBLE_SPAWN_RATE * 1000) {
        const lane = Math.floor(Math.random() * GAME_CONFIG.LANE_COUNT);
        const rand = Math.random();
        let type = TrashType.PLASTIC; // Default
        
        if (rand < 0.33) {
          type = TrashType.PLASTIC;
        } else if (rand < 0.66) {
          type = TrashType.PAPER;
        } else {
          type = TrashType.METAL;
        }
        
        const newCollectible = {
          id: `collectible-${Date.now()}`,
          lane,
          distance: GAME_CONFIG.SPAWN_DISTANCE,
          type
        };
        
        newCollectibles.push(newCollectible);
        set({ lastCollectibleTime: currentTime });
      }

      // Update positions of all game objects
      newObstacles = newObstacles
        .map(obstacle => ({
          ...obstacle,
          distance: obstacle.distance - (newGameSpeed * deltaTime)
        }))
        .filter(obstacle => obstacle.distance > GAME_CONFIG.DESPAWN_DISTANCE);

      newCollectibles = newCollectibles
        .map(collectible => ({
          ...collectible,
          distance: collectible.distance - (newGameSpeed * deltaTime)
        }))
        .filter(collectible => collectible.distance > GAME_CONFIG.DESPAWN_DISTANCE);

      newHazards = newHazards
        .map(hazard => ({
          ...hazard,
          distance: hazard.distance - (newGameSpeed * deltaTime)
        }))
        .filter(hazard => hazard.distance > GAME_CONFIG.DESPAWN_DISTANCE);

      // Calculate new eco level
      const newEcoLevel = Math.max(
        0, 
        ecoLevel - (GAME_CONFIG.ECO_DECREASE_RATE * deltaTime)
      );

      // Check game over condition
      if (newEcoLevel <= 0) {
        get().gameOver();
        return;
      }

      // Update state
      set({
        distance: distance + (newGameSpeed * deltaTime),
        gameSpeed: newGameSpeed,
        ecoLevel: newEcoLevel,
        isJumping: stillJumping,
        jumpHeight: newJumpHeight,
        obstacles: newObstacles,
        collectibles: newCollectibles,
        hazards: newHazards
      });

      // Check for collisions
      const { playerLane } = get();
      
      // Check collectible collisions
      for (const collectible of newCollectibles) {
        if (
          collectible.lane === playerLane &&
          collectible.distance < GAME_CONFIG.PLAYER_RADIUS + GAME_CONFIG.COLLECTIBLE_RADIUS &&
          collectible.distance > 0
        ) {
          // Collect the trash
          get().collectTrash(collectible.type);
          
          // Remove the collectible
          set({
            collectibles: newCollectibles.filter(c => c.id !== collectible.id)
          });
          
          // Play success sound
          const audioStore = useAudio.getState();
          if (!audioStore.isMuted) {
            audioStore.playSuccess();
          }
        }
      }

      // Check obstacle collisions (only if not jumping over)
      for (const obstacle of newObstacles) {
        if (
          obstacle.lane === playerLane &&
          obstacle.distance < GAME_CONFIG.PLAYER_RADIUS + GAME_CONFIG.OBSTACLE_RADIUS &&
          obstacle.distance > 0 &&
          !(isJumping && jumpHeight > 1) // Can jump over if high enough
        ) {
          // Hit the obstacle
          get().hitObstacle();
          
          // Remove the obstacle
          set({
            obstacles: newObstacles.filter(o => o.id !== obstacle.id)
          });
          
          // Play hit sound
          const audioStore = useAudio.getState();
          if (!audioStore.isMuted) {
            audioStore.playHit();
          }
        }
      }
    },

    collectTrash: (type) => {
      const { inventory, score } = get();
      let pointsEarned = 0;
      
      switch (type) {
        case TrashType.PLASTIC:
          pointsEarned = POINTS.PLASTIC_TRASH;
          break;
        case TrashType.PAPER:
          pointsEarned = POINTS.PAPER_TRASH;
          break;
        case TrashType.METAL:
          pointsEarned = POINTS.METAL_TRASH;
          break;
      }
      
      set({
        inventory: {
          ...inventory,
          [type]: inventory[type] + 1
        },
        score: score + pointsEarned,
        ecoLevel: Math.min(
          get().ecoLevel + (pointsEarned * 0.1),
          GAME_CONFIG.MAX_ECO_LEVEL
        )
      });
    },

    hitObstacle: () => {
      const { score, ecoLevel } = get();
      
      set({
        score: Math.max(0, score + POINTS.HIT_OBSTACLE),
        ecoLevel: Math.max(0, ecoLevel - 5)
      });
      
      // Check for game over
      if (get().ecoLevel <= 0) {
        get().gameOver();
      }
    },

    hitHazard: (type) => {
      const { ecoLevel } = get();
      let damage = 0;
      
      switch (type) {
        case HazardType.SMOKE:
          damage = 10;
          break;
        case HazardType.OIL_SPILL:
          damage = 15;
          break;
        case HazardType.INDUSTRIAL_ZONE:
          damage = 20;
          break;
      }
      
      const newEcoLevel = Math.max(0, ecoLevel - damage);
      set({ ecoLevel: newEcoLevel });
      
      // Check for game over
      if (newEcoLevel <= 0) {
        get().gameOver();
      }
    },

    showUpgradeMenu: () => {
      set({ gamePhase: GamePhase.UPGRADE_MENU });
      
      // Pause background music
      const audioStore = useAudio.getState();
      if (audioStore.backgroundMusic) {
        audioStore.backgroundMusic.pause();
      }
    },

    hideUpgradeMenu: () => {
      set({ gamePhase: GamePhase.PLAYING });
      
      // Resume background music
      const audioStore = useAudio.getState();
      if (audioStore.backgroundMusic && !audioStore.isMuted) {
        audioStore.backgroundMusic.play().catch(e => console.log("Failed to resume background music:", e));
      }
    },

    purchaseUpgrade: (type) => {
      const { inventory, upgrades, ecoLevel } = get();
      const costs = GAME_CONFIG.UPGRADE_COSTS[type];
      
      // Check if player has enough resources
      if (
        inventory[TrashType.PLASTIC] >= costs[TrashType.PLASTIC] &&
        inventory[TrashType.PAPER] >= costs[TrashType.PAPER] &&
        inventory[TrashType.METAL] >= costs[TrashType.METAL]
      ) {
        // Deduct resources
        set({
          inventory: {
            [TrashType.PLASTIC]: inventory[TrashType.PLASTIC] - costs[TrashType.PLASTIC],
            [TrashType.PAPER]: inventory[TrashType.PAPER] - costs[TrashType.PAPER],
            [TrashType.METAL]: inventory[TrashType.METAL] - costs[TrashType.METAL]
          },
          upgrades: {
            ...upgrades,
            [type]: upgrades[type] + 1
          },
          score: get().score + GAME_CONFIG.UPGRADE_BENEFITS[type] * 2,
          ecoLevel: Math.min(
            ecoLevel + GAME_CONFIG.UPGRADE_BENEFITS[type],
            GAME_CONFIG.MAX_ECO_LEVEL
          )
        });
        
        // Play success sound
        const audioStore = useAudio.getState();
        if (!audioStore.isMuted) {
          audioStore.playSuccess();
        }
        
        return true;
      }
      
      return false;
    },

    showFact: (factId) => {
      set({ 
        showEcoFact: true,
        currentFactId: factId
      });
    },

    hideFact: () => {
      set({ 
        showEcoFact: false,
        currentFactId: null
      });
    }
  }))
);
