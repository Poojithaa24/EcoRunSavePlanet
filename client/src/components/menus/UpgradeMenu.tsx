import { useState } from 'react';
import { useEcoRun } from '@/lib/stores/useEcoRun';
import { Button } from '@/components/ui/button';
import { UpgradeType, TrashType, GAME_CONFIG } from '@/lib/constants';

// Import SVG icons
import TreeIcon from '@/assets/tree.svg';
import SolarPanelIcon from '@/assets/solar-panel.svg';
import RecyclingCenterIcon from '@/assets/recycling-center.svg';
import PlasticTrashIcon from '@/assets/trash-plastic.svg';
import PaperTrashIcon from '@/assets/trash-paper.svg';
import MetalTrashIcon from '@/assets/trash-metal.svg';

interface UpgradeCardProps {
  type: UpgradeType;
  name: string;
  description: string;
  icon: string;
  benefit: number;
  costs: {
    [TrashType.PLASTIC]: number;
    [TrashType.PAPER]: number;
    [TrashType.METAL]: number;
  };
  currentInventory: {
    [TrashType.PLASTIC]: number;
    [TrashType.PAPER]: number;
    [TrashType.METAL]: number;
  };
  onPurchase: (type: UpgradeType) => void;
  count: number;
}

const UpgradeCard = ({
  type,
  name,
  description,
  icon,
  benefit,
  costs,
  currentInventory,
  onPurchase,
  count
}: UpgradeCardProps) => {
  // Check if player has enough resources
  const canAfford = 
    currentInventory[TrashType.PLASTIC] >= costs[TrashType.PLASTIC] &&
    currentInventory[TrashType.PAPER] >= costs[TrashType.PAPER] &&
    currentInventory[TrashType.METAL] >= costs[TrashType.METAL];

  return (
    <div className={`border rounded-lg overflow-hidden shadow-md ${canAfford ? 'border-green-500' : 'border-gray-300'}`}>
      <div className="p-4">
        <div className="flex items-center mb-3">
          <img src={icon} alt={name} className="w-10 h-10 mr-3" />
          <div>
            <h3 className="font-bold text-lg">{name}</h3>
            <p className="text-sm text-gray-500">Built: {count}</p>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        
        <div className="bg-green-50 p-2 rounded mb-3">
          <p className="text-sm text-green-700">+{benefit} Eco-meter points</p>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2">Cost:</h4>
          <div className="flex space-x-4">
            {costs[TrashType.PLASTIC] > 0 && (
              <div className="flex items-center">
                <img src={PlasticTrashIcon} alt="Plastic" className="w-5 h-5 mr-1" />
                <span className={currentInventory[TrashType.PLASTIC] >= costs[TrashType.PLASTIC] ? 'text-green-600' : 'text-red-600'}>
                  {costs[TrashType.PLASTIC]}
                </span>
              </div>
            )}
            
            {costs[TrashType.PAPER] > 0 && (
              <div className="flex items-center">
                <img src={PaperTrashIcon} alt="Paper" className="w-5 h-5 mr-1" />
                <span className={currentInventory[TrashType.PAPER] >= costs[TrashType.PAPER] ? 'text-green-600' : 'text-red-600'}>
                  {costs[TrashType.PAPER]}
                </span>
              </div>
            )}
            
            {costs[TrashType.METAL] > 0 && (
              <div className="flex items-center">
                <img src={MetalTrashIcon} alt="Metal" className="w-5 h-5 mr-1" />
                <span className={currentInventory[TrashType.METAL] >= costs[TrashType.METAL] ? 'text-green-600' : 'text-red-600'}>
                  {costs[TrashType.METAL]}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <Button
          onClick={() => onPurchase(type)}
          disabled={!canAfford}
          className={`w-full ${canAfford ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400'} text-white`}
        >
          Build
        </Button>
      </div>
    </div>
  );
};

const UpgradeMenu = () => {
  const { 
    inventory, 
    upgrades, 
    hideUpgradeMenu, 
    purchaseUpgrade,
    ecoLevel
  } = useEcoRun();
  
  const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null);
  
  const handlePurchase = (type: UpgradeType) => {
    const success = purchaseUpgrade(type);
    
    if (success) {
      setPurchaseMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} successfully built!`);
      
      // Clear message after 2 seconds
      setTimeout(() => {
        setPurchaseMessage(null);
      }, 2000);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-blue-500 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Eco Projects</h2>
            <div className="text-right">
              <p className="text-sm opacity-90">Eco-meter Level</p>
              <p className="text-xl font-semibold">{Math.round(ecoLevel)}%</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {purchaseMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
              {purchaseMessage}
            </div>
          )}
          
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-gray-800 text-lg font-semibold">Available Resources</h3>
            <div className="flex space-x-6">
              <div className="flex items-center">
                <img src={PlasticTrashIcon} alt="Plastic" className="w-6 h-6 mr-2" />
                <span className="font-semibold">{inventory[TrashType.PLASTIC]}</span>
              </div>
              <div className="flex items-center">
                <img src={PaperTrashIcon} alt="Paper" className="w-6 h-6 mr-2" />
                <span className="font-semibold">{inventory[TrashType.PAPER]}</span>
              </div>
              <div className="flex items-center">
                <img src={MetalTrashIcon} alt="Metal" className="w-6 h-6 mr-2" />
                <span className="font-semibold">{inventory[TrashType.METAL]}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <UpgradeCard
              type={UpgradeType.TREE}
              name="Plant Tree"
              description="Trees absorb CO2, provide oxygen, and create habitats for wildlife."
              icon={TreeIcon}
              benefit={GAME_CONFIG.UPGRADE_BENEFITS[UpgradeType.TREE]}
              costs={GAME_CONFIG.UPGRADE_COSTS[UpgradeType.TREE]}
              currentInventory={inventory}
              onPurchase={handlePurchase}
              count={upgrades[UpgradeType.TREE]}
            />
            
            <UpgradeCard
              type={UpgradeType.SOLAR_PANEL}
              name="Solar Panel"
              description="Generate clean, renewable energy from the sun to power communities."
              icon={SolarPanelIcon}
              benefit={GAME_CONFIG.UPGRADE_BENEFITS[UpgradeType.SOLAR_PANEL]}
              costs={GAME_CONFIG.UPGRADE_COSTS[UpgradeType.SOLAR_PANEL]}
              currentInventory={inventory}
              onPurchase={handlePurchase}
              count={upgrades[UpgradeType.SOLAR_PANEL]}
            />
            
            <UpgradeCard
              type={UpgradeType.RECYCLING_CENTER}
              name="Recycling Center"
              description="Process recyclable materials to reduce landfill waste and conserve resources."
              icon={RecyclingCenterIcon}
              benefit={GAME_CONFIG.UPGRADE_BENEFITS[UpgradeType.RECYCLING_CENTER]}
              costs={GAME_CONFIG.UPGRADE_COSTS[UpgradeType.RECYCLING_CENTER]}
              currentInventory={inventory}
              onPurchase={handlePurchase}
              count={upgrades[UpgradeType.RECYCLING_CENTER]}
            />
          </div>
          
          <div className="flex justify-center">
            <Button
              onClick={hideUpgradeMenu}
              className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Return to Game
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeMenu;
