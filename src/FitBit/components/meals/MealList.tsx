import React from "react";
import type { MealListProps } from "../../types";
import { MealItem } from "./MealItem";

export const MealList: React.FC<MealListProps> = ({
  meals,
  searchTerm,
  onDragStart,
  isAddingMeal = false,
}) => {
  const filteredMeals = meals.filter((meal) =>
    meal.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-3">
      {isAddingMeal && (
        <div className="bg-gray-700 rounded-lg p-3 border-l-4 border-blue-400 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-300 text-sm">Adding new meal...</span>
          </div>
        </div>
      )}

      {filteredMeals.map((meal, index) => (
        <div
          key={meal.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <MealItem meal={meal} onDragStart={onDragStart} isFromList />
        </div>
      ))}
    </div>
  );
};
