import { cn } from '@/lib/utils';
import { GAME_CONFIG } from '@/lib/constants';

interface EcoMeterProps {
  value: number;
  className?: string;
}

export function EcoMeter({ value, className }: EcoMeterProps) {
  // Normalize value to percentage
  const percentage = Math.min(100, Math.max(0, (value / GAME_CONFIG.MAX_ECO_LEVEL) * 100));
  
  // Determine color based on percentage
  const getColor = () => {
    if (percentage < 25) return "bg-red-500";
    if (percentage < 50) return "bg-orange-500";
    if (percentage < 75) return "bg-yellow-500";
    return "bg-green-500";
  };
  
  // Determine label based on percentage
  const getLabel = () => {
    if (percentage < 15) return "Critical!";
    if (percentage < 30) return "Endangered";
    if (percentage < 50) return "Struggling";
    if (percentage < 75) return "Improving";
    if (percentage < 90) return "Healthy";
    return "Thriving!";
  };

  return (
    <div className={cn("bg-gray-800 p-3 rounded-lg shadow-lg", className)}>
      <div className="flex items-center mb-1">
        <span className="material-icons text-green-400 mr-1">eco</span>
        <p className="text-white text-sm">Eco-Meter</p>
      </div>
      
      <div className="w-40 h-5 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getColor()} transition-all duration-300 ease-out`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between mt-1">
        <p className="text-xs text-gray-300">{Math.round(percentage)}%</p>
        <p className="text-xs text-gray-300">{getLabel()}</p>
      </div>
    </div>
  );
}
