import React from "react";
import type { LucideIcon } from "lucide-react";

interface NutritionStatCardProps {
  icon: LucideIcon;
  value: number;
  label: string;
  unit: string;
  color: string;
}

export const NutritionStatCard: React.FC<NutritionStatCardProps> = ({
  icon: Icon,
  value,
  label,
  unit,
  color,
}) => {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 flex items-center gap-3 shadow-lg border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner"
        style={{
          backgroundColor: `${color}15`,
          boxShadow: `0 0 20px ${color}20`
        }}
      >
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <p className="text-white font-semibold">
          {value.toLocaleString()}
          <span className="text-gray-400 text-sm ml-1">{unit}</span>
        </p>
        <p className="text-gray-500 text-xs">{label}</p>
      </div>
    </div>
  );
};
