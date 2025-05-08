import { useState, useEffect } from 'react';
import { useEcoRun } from '@/lib/stores/useEcoRun';
import { useAudio } from '@/lib/stores/useAudio';
import { Button } from '@/components/ui/button';
import EcoCharacterIcon from '@/assets/eco-character.svg';

const StartMenu = () => {
  const { startGame, tutorialComplete } = useEcoRun();
  const { toggleMute, isMuted } = useAudio();
  const [showIntro, setShowIntro] = useState(true);
  
  // Automatically hide intro after 3 seconds
  useEffect(() => {
    if (showIntro) {
      const timer = setTimeout(() => {
        setShowIntro(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showIntro]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-sky-400 to-green-500">
      <div className="max-w-2xl mx-auto text-center p-6 rounded-lg bg-white/80 backdrop-blur-sm shadow-xl">
        {showIntro ? (
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-3">
              EcoRun
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-blue-700 mb-6">
              Save the Planet!
            </h2>
            <div className="w-24 h-24 mx-auto mb-4">
              <img src={EcoCharacterIcon} alt="Eco Hero" className="w-full h-full" />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-green-800 mb-3">
              EcoRun: Save the Planet
            </h1>
            
            <p className="text-lg text-gray-700 mb-4">
              Run, collect trash, and build eco-friendly projects to save our planet!
            </p>
            
            <div className="flex flex-col space-y-4 items-center">
              <Button
                onClick={startGame}
                className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 text-xl"
              >
                {tutorialComplete ? "Start Game" : "Start Tutorial"}
              </Button>
              
              <Button
                onClick={toggleMute}
                variant="outline"
                className="bg-transparent border border-gray-400"
              >
                {isMuted ? "Sound: Off" : "Sound: On"}
              </Button>
            </div>
            
            <div className="mt-8 text-sm text-gray-600 max-w-md mx-auto">
              <h3 className="font-semibold mb-2">How to Play:</h3>
              <ul className="list-disc text-left pl-6 space-y-1">
                <li>Use arrow keys or WASD to move between lanes</li>
                <li>Press SPACE to jump over obstacles</li>
                <li>Press DOWN to slide under hazards</li>
                <li>Collect different types of trash for points</li>
                <li>Use collected trash to build eco-projects</li>
                <li>Keep the Eco-Meter from reaching zero!</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartMenu;
