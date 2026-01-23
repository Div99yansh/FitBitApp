import React from "react";
import { X } from "lucide-react";
import type { MealSlotProps } from "../../types";
import { MealItem } from "./MealItem";

export const MealSlot: React.FC<MealSlotProps> = ({
  meal,
  categoryId,
  onRemoveMeal,
  onDragStart,
}) => {
  return (
    <div className="relative group">
      <div className="relative">
        <MealItem meal={meal} onDragStart={onDragStart} />
        <button
          onClick={() => onRemoveMeal(categoryId, meal.id)}
          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
};
