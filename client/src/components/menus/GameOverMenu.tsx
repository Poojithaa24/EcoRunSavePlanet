import { useEcoRun } from '@/lib/stores/useEcoRun';
import { Button } from '@/components/ui/button';

const GameOverMenu = () => {
  const { score, distance, restartGame, upgrades } = useEcoRun();
  
  // Calculate total eco-projects built
  const totalProjects = Object.values(upgrades).reduce((sum, count) => sum + count, 0);
  
  // Format distance to 2 decimal places
  const formattedDistance = Math.floor(distance * 10) / 10;
  
  // Determine player's achievement message
  const getAchievementMessage = () => {
    if (score > 2000) {
      return "Eco Champion! You're a true planet saver!";
    } else if (score > 1000) {
      return "Eco Warrior! You've made a real difference!";
    } else if (score > 500) {
      return "Eco Friend! You're on the right track!";
    } else {
      return "Eco Beginner! Keep trying to save the planet!";
    }
  };
  
  // Provide a real-world eco tip
  const getEcoTip = () => {
    const tips = [
      "Reduce plastic use by carrying reusable bags, bottles and containers.",
      "Save energy by unplugging electronics when not in use.",
      "Choose to walk, bike, or use public transport instead of driving when possible.",
      "Start composting food scraps to reduce landfill waste and create fertilizer.",
      "Use less water by taking shorter showers and turning off the tap while brushing teeth.",
      "Buy local and seasonal food to reduce transportation emissions.",
      "Recycle properly by learning your local recycling guidelines.",
      "Plant native trees and plants in your garden to support local ecosystems."
    ];
    
    return tips[Math.floor(Math.random() * tips.length)];
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80">
      <div className="max-w-md w-full bg-white rounded-lg shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white text-center">
          <h2 className="text-3xl font-bold">Game Over</h2>
          <p className="mt-2 text-white/90">The eco-meter reached zero!</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <p className="text-gray-500 text-sm">Final Score</p>
              <p className="text-3xl font-bold text-green-600">{score}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-sm">Distance</p>
              <p className="text-3xl font-bold text-blue-600">{formattedDistance}m</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Impact</h3>
            <p className="text-gray-600">You built {totalProjects} eco-projects to help save the planet!</p>
            <p className="mt-3 font-medium text-green-700">{getAchievementMessage()}</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="text-md font-semibold text-blue-800 mb-1">Eco Tip:</h3>
            <p className="text-blue-700">{getEcoTip()}</p>
          </div>
          
          <Button
            onClick={restartGame}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
          >
            Play Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameOverMenu;
