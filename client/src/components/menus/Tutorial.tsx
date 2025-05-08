import { useState } from 'react';
import { useEcoRun } from '@/lib/stores/useEcoRun';
import { Button } from '@/components/ui/button';
import PlasticTrashIcon from '@/assets/trash-plastic.svg';
import PaperTrashIcon from '@/assets/trash-paper.svg';
import MetalTrashIcon from '@/assets/trash-metal.svg';
import TreeIcon from '@/assets/tree.svg';
import SmokeIcon from '@/assets/smoke.svg';
import OilSpillIcon from '@/assets/oil-spill.svg';

const Tutorial = () => {
  const [step, setStep] = useState(1);
  const { endTutorial } = useEcoRun();
  
  const totalSteps = 5;
  
  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      endTutorial();
    }
  };
  
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-sky-400 to-green-500">
      <div className="max-w-2xl w-full mx-4 bg-white rounded-lg shadow-2xl overflow-hidden">
        <div className="bg-blue-600 p-4 text-white">
          <h2 className="text-xl font-bold">Tutorial: EcoRun Basics</h2>
          <div className="flex justify-between mt-2">
            <p>Step {step} of {totalSteps}</p>
            <button 
              onClick={endTutorial}
              className="text-sm underline hover:text-blue-200"
            >
              Skip Tutorial
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-blue-800">Welcome to EcoRun!</h3>
              <p>
                In this game, you'll run through an environment that needs your help.
                Your mission is to collect trash, avoid obstacles, and build eco-friendly
                projects to save the planet!
              </p>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Game Objective:</h4>
                <p>
                  Keep the Eco-Meter from reaching zero by collecting trash and building
                  eco-projects. The longer you run, the more impact you'll make!
                </p>
              </div>
              <img 
                src="/textures/grass.png" 
                alt="EcoRun World" 
                className="w-full h-32 object-cover rounded-lg my-4" 
              />
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-blue-800">Controls</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="font-semibold">Movement:</p>
                  <ul className="mt-2 space-y-2">
                    <li>← → or A/D: Move left/right</li>
                    <li>Space: Jump over obstacles</li>
                    <li>↓ or S: Slide under hazards</li>
                  </ul>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="font-semibold">Game Actions:</p>
                  <ul className="mt-2 space-y-2">
                    <li>U: Open Upgrade Menu</li>
                    <li>M: Toggle Sound</li>
                    <li>ESC: Pause Game</li>
                  </ul>
                </div>
              </div>
              <p className="text-gray-600">
                Timing is everything! Jump at the right moment to avoid obstacles and 
                collect trash efficiently.
              </p>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-blue-800">Collecting Trash</h3>
              <p>
                As you run, you'll encounter different types of trash to collect.
                Each type gives you different points and resources:
              </p>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <img src={PlasticTrashIcon} alt="Plastic" className="w-10 h-10 mx-auto mb-2" />
                  <p className="font-semibold">Plastic</p>
                  <p className="text-sm text-blue-700">5 points</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg text-center">
                  <img src={PaperTrashIcon} alt="Paper" className="w-10 h-10 mx-auto mb-2" />
                  <p className="font-semibold">Paper</p>
                  <p className="text-sm text-yellow-700">10 points</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg text-center">
                  <img src={MetalTrashIcon} alt="Metal" className="w-10 h-10 mx-auto mb-2" />
                  <p className="font-semibold">Metal</p>
                  <p className="text-sm text-gray-700">20 points</p>
                </div>
              </div>
              <p className="text-gray-600">
                Collect and save these resources - you'll need them to build eco-projects!
              </p>
            </div>
          )}
          
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-blue-800">Avoiding Hazards</h3>
              <p>
                Watch out for environmental hazards that will reduce your Eco-Meter:
              </p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex items-center mb-2">
                    <img src={SmokeIcon} alt="Smoke" className="w-8 h-8 mr-2" />
                    <p className="font-semibold">Pollution Smoke</p>
                  </div>
                  <p className="text-sm">Jump over or slide under to avoid breathing toxic fumes</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex items-center mb-2">
                    <img src={OilSpillIcon} alt="Oil Spill" className="w-8 h-8 mr-2" />
                    <p className="font-semibold">Oil Spills</p>
                  </div>
                  <p className="text-sm">These slippery hazards will slow you down - jump over them!</p>
                </div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg mt-4">
                <p className="text-red-700">
                  <span className="font-semibold">Warning:</span> Hitting obstacles will cost you points and reduce your Eco-Meter!
                </p>
              </div>
            </div>
          )}
          
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-blue-800">Building Eco-Projects</h3>
              <p>
                Press U during the game to open the Upgrade Menu. Use your collected trash 
                to build eco-friendly projects that will boost your Eco-Meter:
              </p>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <img src={TreeIcon} alt="Tree" className="w-10 h-10 mr-3" />
                  <div>
                    <p className="font-semibold">Plant Trees</p>
                    <p className="text-sm text-green-700">Absorb CO2 and provide habitats for wildlife</p>
                  </div>
                </div>
                <p className="text-sm mt-2">
                  Other projects include Solar Panels and Recycling Centers - each 
                  provides different benefits to the environment!
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg mt-4">
                <h4 className="font-semibold mb-2">Eco Facts</h4>
                <p>
                  As you progress, you'll learn interesting facts about environmental 
                  conservation. These tips can be helpful in real life too!
                </p>
              </div>
            </div>
          )}
          
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <Button
                onClick={prevStep}
                variant="outline"
                className="px-4"
              >
                Previous
              </Button>
            ) : (
              <div></div> // Empty div for spacing
            )}
            
            <Button
              onClick={nextStep}
              className="px-8 bg-green-600 hover:bg-green-700 text-white"
            >
              {step === totalSteps ? "Start Playing!" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
