import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import { useAudio } from "./lib/stores/useAudio";
import { Controls } from "./lib/constants";
import { Howl } from "howler";
import "@fontsource/inter";

// Game components
import Player from "./components/game/Player";
import Terrain from "./components/game/Terrain";
import Obstacles from "./components/game/Obstacles";
import Collectibles from "./components/game/Collectibles";
import GameUI from "./components/game/GameUI";

// Menu components
import StartMenu from "./components/menus/StartMenu";
import GameOverMenu from "./components/menus/GameOverMenu";
import UpgradeMenu from "./components/menus/UpgradeMenu";
import Tutorial from "./components/menus/Tutorial";

// Store
import { useEcoRun } from "./lib/stores/useEcoRun";

// Define control keys for the game
const controls = [
  { name: Controls.forward, keys: ["KeyW", "ArrowUp"] },
  { name: Controls.backward, keys: ["KeyS", "ArrowDown"] },
  { name: Controls.leftward, keys: ["KeyA", "ArrowLeft"] },
  { name: Controls.rightward, keys: ["KeyD", "ArrowRight"] },
  { name: Controls.jump, keys: ["Space"] },
];

// Sound components management
function SoundManager() {
  const { 
    setBackgroundMusic, 
    setHitSound, 
    setSuccessSound, 
    toggleMute,
    isMuted 
  } = useAudio();

  useEffect(() => {
    // Initialize background music
    const backgroundMusic = new Audio("/sounds/background.mp3");
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;
    setBackgroundMusic(backgroundMusic);

    // Initialize sound effects
    const hitSound = new Audio("/sounds/hit.mp3");
    setHitSound(hitSound);

    const successSound = new Audio("/sounds/success.mp3");
    setSuccessSound(successSound);

    // Auto-muted by default (see useAudio store)
    console.log("Sound initialized, muted:", isMuted);

    return () => {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    };
  }, [setBackgroundMusic, setHitSound, setSuccessSound, isMuted]);

  return null;
}

// Main App component
function App() {
  const { gamePhase } = useEcoRun();
  const [showCanvas, setShowCanvas] = useState(false);

  // Show the canvas once everything is loaded
  useEffect(() => {
    setShowCanvas(true);
  }, []);

  return (
    <div 
      style={{ 
        width: '100vw', 
        height: '100vh', 
        position: 'relative', 
        overflow: 'hidden',
        backgroundColor: "#87CEEB" // Sky blue background
      }}
    >
      {showCanvas && (
        <KeyboardControls map={controls}>
          {gamePhase === 'start_menu' && <StartMenu />}
          
          {gamePhase === 'tutorial' && <Tutorial />}

          {gamePhase === 'playing' && (
            <>
              <Canvas
                shadows
                camera={{
                  position: [0, 5, 10],
                  fov: 60,
                  near: 0.1,
                  far: 1000
                }}
                gl={{
                  antialias: true,
                  powerPreference: "default"
                }}
              >
                <color attach="background" args={["#87CEEB"]} />

                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <directionalLight 
                  position={[10, 10, 5]} 
                  intensity={1} 
                  castShadow 
                  shadow-mapSize={[2048, 2048]} 
                />

                <Suspense fallback={null}>
                  <Terrain />
                  <Player />
                  <Obstacles />
                  <Collectibles />
                </Suspense>
              </Canvas>
              <GameUI />
            </>
          )}

          {gamePhase === 'upgrade_menu' && <UpgradeMenu />}
          
          {gamePhase === 'game_over' && <GameOverMenu />}

          <SoundManager />
        </KeyboardControls>
      )}
    </div>
  );
}

export default App;
