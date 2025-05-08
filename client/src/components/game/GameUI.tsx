import { useEffect, useRef } from 'react';
import { useEcoRun } from '@/lib/stores/useEcoRun';
import { useAudio } from '@/lib/stores/useAudio';
import { TrashType, UpgradeType } from '@/lib/constants';
import { EcoMeter } from '@/components/ui/eco-meter';
import { EcoFact } from '@/components/ui/eco-fact';
import { getRandomFact } from '@/lib/facts';
import { cn } from '@/lib/utils';

// Import SVG trash icons
import PlasticTrashIcon from '@/assets/trash-plastic.svg';
import PaperTrashIcon from '@/assets/trash-paper.svg';
import MetalTrashIcon from '@/assets/trash-metal.svg';

const GameUI = () => {
  const { 
    score, 
    distance, 
    ecoLevel, 
    inventory, 
    showUpgradeMenu,
    showEcoFact,
    currentFactId,
    showFact,
    hideFact
  } = useEcoRun();
  
  const { isMuted, toggleMute } = useAudio();
  
  // Format distance to 2 decimal places
  const formattedDistance = Math.floor(distance * 10) / 10;
  
  // Reference to track last milestone
  const lastMilestoneRef = useRef(0);
  
  // Show eco fact at certain milestones
  useEffect(() => {
    const milestone = Math.floor(distance / 100) * 100;
    if (milestone > 0 && milestone !== lastMilestoneRef.current) {
      lastMilestoneRef.current = milestone;
      
      // Show a random eco fact
      const fact = getRandomFact();
      showFact(fact.id);
      
      // Hide fact after 5 seconds
      setTimeout(() => {
        hideFact();
      }, 5000);
    }
  }, [distance, showFact, hideFact]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top bar with score and eco-meter */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center pointer-events-auto">
        <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg">
          <div className="flex items-center space-x-3">
            <div>
              <p className="text-sm text-gray-300">Score</p>
              <p className="text-2xl font-bold">{score}</p>
            </div>
            <div className="border-l border-gray-600 h-10 mx-2" />
            <div>
              <p className="text-sm text-gray-300">Distance</p>
              <p className="text-xl">{formattedDistance}m</p>
            </div>
          </div>
        </div>
        
        <EcoMeter value={ecoLevel} />
        
        {/* Sound toggle */}
        <button 
          onClick={toggleMute} 
          className="bg-gray-800 text-white p-2 rounded-lg shadow-lg"
        >
          {isMuted ? (
            <span className="material-icons">volume_off</span>
          ) : (
            <span className="material-icons">volume_up</span>
          )}
        </button>
      </div>
      
      {/* Inventory display */}
      <div className="absolute bottom-4 left-4 bg-gray-800 text-white p-3 rounded-lg shadow-lg">
        <h3 className="text-sm text-gray-300 mb-2">Inventory</h3>
        <div className="flex space-x-4">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 flex items-center justify-center">
              <img src={PlasticTrashIcon} alt="Plastic" className="w-6 h-6" />
            </div>
            <span className="text-lg font-bold">{inventory[TrashType.PLASTIC]}</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 flex items-center justify-center">
              <img src={PaperTrashIcon} alt="Paper" className="w-6 h-6" />
            </div>
            <span className="text-lg font-bold">{inventory[TrashType.PAPER]}</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 flex items-center justify-center">
              <img src={MetalTrashIcon} alt="Metal" className="w-6 h-6" />
            </div>
            <span className="text-lg font-bold">{inventory[TrashType.METAL]}</span>
          </div>
        </div>
      </div>
      
      {/* Controls hint */}
      <div className="absolute bottom-4 right-4 bg-gray-800 text-white p-3 rounded-lg shadow-lg">
        <h3 className="text-sm text-gray-300 mb-1">Controls</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <span>← → : Move</span>
          <span>Space : Jump</span>
          <span>↓ : Slide</span>
          <span>U : Upgrades</span>
        </div>
      </div>
      
      {/* Upgrade Button */}
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-auto">
        <button
          onClick={showUpgradeMenu}
          className="bg-green-600 hover:bg-green-700 text-white py-3 px-5 rounded-lg shadow-lg font-bold transition"
        >
          Upgrade (U)
        </button>
      </div>
      
      {/* Eco Facts */}
      {showEcoFact && currentFactId && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <EcoFact factId={currentFactId} onClose={hideFact} />
        </div>
      )}
    </div>
  );
};

export default GameUI;
