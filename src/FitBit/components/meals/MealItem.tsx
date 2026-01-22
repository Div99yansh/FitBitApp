import React from "react";
import type { MealItemProps } from "../../types";

export const MealItem: React.FC<MealItemProps> = ({
  meal,
  onDragStart,
  isFromList = false,
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(meal);
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("application/json", JSON.stringify(meal));
  };

  const formatNutritionInfo = () => {
    const parts = [];
    parts.push(`${meal.calories} cal`);
    parts.push(`${meal.protein}g protein`);
    parts.push(`${meal.carbohydrates}g carbs`);
    parts.push(`${meal.fats}g fats`);
    if (meal.fiber > 0) parts.push(`${meal.fiber}g fiber`);
    if (meal.sugar > 0) parts.push(`${meal.sugar}g sugar`);
    if (meal.sodium > 0) parts.push(`${meal.sodium}mg sodium`);
    return parts.join(" • ");
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`bg-gray-700 rounded-lg p-3 cursor-grab active:cursor-grabbing transition-all duration-200 hover:bg-gray-600 hover:scale-105 hover:shadow-lg ${
        isFromList ? "border-l-4 border-blue-400" : "border border-gray-600"
      }`}
    >
      <div className="font-medium text-white text-sm mb-2">{meal.name}</div>
      <div className="text-gray-300 text-xs">{formatNutritionInfo()}</div>
    </div>
  );
};
