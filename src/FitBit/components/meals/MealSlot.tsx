import React from "react";
import { X } from "lucide-react";
import type { MealSlotProps } from "../../types";

export const MealSlot: React.FC<MealSlotProps> = ({
  meal,
  categoryId,
  onRemoveMeal,
}) => {
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
    <div className="relative group">
      <div className="relative">
        {/* Static display - not draggable */}
        <div className="bg-gray-700 rounded-lg p-3 border border-gray-600">
          <div className="font-medium text-white text-sm mb-2">{meal.name}</div>
          <div className="text-gray-300 text-xs">{formatNutritionInfo()}</div>
        </div>
        <button
          onClick={() => onRemoveMeal(categoryId, meal.id)}
          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
};
