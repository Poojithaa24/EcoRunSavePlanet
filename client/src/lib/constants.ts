// Game Controls
export enum Controls {
  forward = 'forward',
  backward = 'backward',
  leftward = 'leftward',
  rightward = 'rightward',
  jump = 'jump',
}

// Game Phases
export enum GamePhase {
  START_MENU = 'start_menu',
  TUTORIAL = 'tutorial',
  PLAYING = 'playing',
  UPGRADE_MENU = 'upgrade_menu',
  GAME_OVER = 'game_over',
}

// Trash Types
export enum TrashType {
  PLASTIC = 'plastic',
  PAPER = 'paper',
  METAL = 'metal',
}

// Hazard Types
export enum HazardType {
  SMOKE = 'smoke',
  OIL_SPILL = 'oil_spill',
  INDUSTRIAL_ZONE = 'industrial_zone',
}

// Upgrade Types
export enum UpgradeType {
  TREE = 'tree',
  SOLAR_PANEL = 'solar_panel',
  RECYCLING_CENTER = 'recycling_center',
}

// Point Values
export const POINTS = {
  PLASTIC_TRASH: 5,
  PAPER_TRASH: 10,
  METAL_TRASH: 20,
  AVOID_HAZARD: 10,
  HIT_OBSTACLE: -10,
  TREE_PLANTED: 50,
  SOLAR_PANEL: 75,
  RECYCLING_CENTER: 100,
};

// Game Configuration
export const GAME_CONFIG = {
  // Movement
  PLAYER_SPEED: 5,
  JUMP_FORCE: 8,
  GRAVITY: 0.5,
  
  // World
  LANE_WIDTH: 2,
  LANE_COUNT: 3,
  SPAWN_DISTANCE: 50,
  DESPAWN_DISTANCE: -10,
  
  // Difficulty progression
  BASE_SCROLL_SPEED: 0.4,
  SPEED_INCREASE_RATE: 0.0001,
  MAX_SCROLL_SPEED: 1.2,
  
  // Spawn rates (lower = more frequent)
  OBSTACLE_SPAWN_RATE: 1.5,
  COLLECTIBLE_SPAWN_RATE: 1.0,
  HAZARD_SPAWN_RATE: 2.5,
  
  // Collisions
  PLAYER_RADIUS: 0.5,
  OBSTACLE_RADIUS: 0.7,
  COLLECTIBLE_RADIUS: 0.5,
  HAZARD_RADIUS: 0.8,
  
  // Eco-meter
  INITIAL_ECO_LEVEL: 20,
  MAX_ECO_LEVEL: 100,
  ECO_DECREASE_RATE: 0.02,
  
  // Upgrade costs
  UPGRADE_COSTS: {
    [UpgradeType.TREE]: {
      [TrashType.PLASTIC]: 5,
      [TrashType.PAPER]: 3,
      [TrashType.METAL]: 0,
    },
    [UpgradeType.SOLAR_PANEL]: {
      [TrashType.PLASTIC]: 10,
      [TrashType.PAPER]: 5,
      [TrashType.METAL]: 3,
    },
    [UpgradeType.RECYCLING_CENTER]: {
      [TrashType.PLASTIC]: 15,
      [TrashType.PAPER]: 10,
      [TrashType.METAL]: 5,
    },
  },
  
  // Upgrade benefits
  UPGRADE_BENEFITS: {
    [UpgradeType.TREE]: 5, // Eco-meter points
    [UpgradeType.SOLAR_PANEL]: 10, // Eco-meter points
    [UpgradeType.RECYCLING_CENTER]: 15, // Eco-meter points
  },
};
