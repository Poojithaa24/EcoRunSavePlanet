import { useEffect, useState } from 'react';
import { ecoFacts, EcoFact as EcoFactType } from '@/lib/facts';
import { Button } from './button';

interface EcoFactProps {
  factId: number;
  onClose: () => void;
}

export function EcoFact({ factId, onClose }: EcoFactProps) {
  const [fact, setFact] = useState<EcoFactType | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const selectedFact = ecoFacts.find(f => f.id === factId);
    if (selectedFact) {
      setFact(selectedFact);
      
      // Animate in
      setTimeout(() => {
        setIsVisible(true);
      }, 10);
    }
  }, [factId]);
  
  const handleClose = () => {
    // Animate out
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };
  
  // Category color mapping
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'recycling': return 'bg-blue-600';
      case 'conservation': return 'bg-green-600';
      case 'pollution': return 'bg-red-600';
      case 'energy': return 'bg-yellow-600';
      default: return 'bg-purple-600';
    }
  };
  
  if (!fact) return null;

  return (
    <div 
      className={`
        max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden
        transition-all duration-300 transform
        ${isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}
      `}
    >
      <div className={`${getCategoryColor(fact.category)} p-4 text-white`}>
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">{fact.title}</h3>
          <span className="capitalize px-2 py-1 bg-white/20 rounded-full text-xs">
            {fact.category}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <p className="text-gray-700 mb-4">{fact.content}</p>
        
        <div className="flex justify-between">
          <p className="text-xs text-gray-500">Eco Fact #{fact.id}</p>
          <Button 
            onClick={handleClose}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Got it!
          </Button>
        </div>
      </div>
    </div>
  );
}
