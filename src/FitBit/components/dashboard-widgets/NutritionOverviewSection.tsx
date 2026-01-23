import React from "react";
import { Flame, Beef, Wheat, Droplets, Leaf, Candy, CircleDot } from "lucide-react";
import { MacroBreakdownChart } from "./MacroBreakdownChart";
import { NutritionStatCard } from "./NutritionStatCard";

interface NutritionOverviewSectionProps {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  totalFiber: number;
  totalSugar: number;
  totalSodium: number;
}

export const NutritionOverviewSection: React.FC<
  NutritionOverviewSectionProps
> = ({
  totalCalories,
  totalProtein,
  totalCarbs,
  totalFats,
  totalFiber,
  totalSugar,
  totalSodium,
}) => {
  const stats = [
    {
      icon: Flame,
      value: totalCalories,
      label: "Calories",
      unit: "kcal",
      color: "#3B82F6",
    },
    {
      icon: Beef,
      value: totalProtein,
      label: "Protein",
      unit: "g",
      color: "#22C55E",
    },
    {
      icon: Wheat,
      value: totalCarbs,
      label: "Carbs",
      unit: "g",
      color: "#F59E0B",
    },
    {
      icon: Droplets,
      value: totalFats,
      label: "Fats",
      unit: "g",
      color: "#EF4444",
    },
    {
      icon: Leaf,
      value: totalFiber,
      label: "Fiber",
      unit: "g",
      color: "#8B5CF6",
    },
    {
      icon: Candy,
      value: totalSugar,
      label: "Sugar",
      unit: "g",
      color: "#EC4899",
    },
    {
      icon: CircleDot,
      value: totalSodium,
      label: "Sodium",
      unit: "mg",
      color: "#06B6D4",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-1">
        <MacroBreakdownChart
          protein={totalProtein}
          carbs={totalCarbs}
          fats={totalFats}
        />
      </div>
      <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <NutritionStatCard
            key={stat.label}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            unit={stat.unit}
            color={stat.color}
          />
        ))}
      </div>
    </div>
  );
};
