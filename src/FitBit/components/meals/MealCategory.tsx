import React, { useState, useCallback } from "react";
import { useDroppable } from "@dnd-kit/core";
import { Save } from "lucide-react";
import type { MealCategoryProps, Meal } from "../../types";
import { MealSlot } from "./MealSlot";

export const MealCategory: React.FC<MealCategoryProps> = ({
  category,
  onDropMeal,
  onRemoveMeal,
  onSaveMeals,
  isSaving,
  hasChanges,
}) => {
  const [isNativeDragOver, setIsNativeDragOver] = useState(false);

  const { isOver, setNodeRef } = useDroppable({
    id: `meal-category-${category.id}`,
    data: { categoryId: category.id, type: "meal-category" },
  });

  // Native HTML5 drag handlers for desktop
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsNativeDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    // Only set to false if we're leaving the container (not entering a child)
    const relatedTarget = e.relatedTarget as Node | null;
    if (!e.currentTarget.contains(relatedTarget)) {
      setIsNativeDragOver(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsNativeDragOver(false);

      const mealData = e.dataTransfer.getData("application/json");
      if (mealData) {
        try {
          const meal = JSON.parse(mealData) as Meal;
          onDropMeal(category.id, meal);
        } catch (err) {
          console.error("Failed to parse meal data:", err);
        }
      }
    },
    [category.id, onDropMeal]
  );

  // Combine both dnd-kit and native drag states for visual feedback
  const isDragOver = isOver || isNativeDragOver;

  return (
    <div
      ref={setNodeRef}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`bg-gray-800 rounded-xl p-4 transition-all duration-300 min-h-[200px] relative ${
        isDragOver ? "ring-2 ring-blue-400 bg-gray-700" : ""
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-semibold text-lg">{category.name}</h3>
        <button
          onClick={() => onSaveMeals(category.id)}
          disabled={isSaving || !hasChanges}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
            !hasChanges
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : isSaving
              ? "bg-green-500 text-white cursor-wait"
              : "bg-green-600 hover:bg-green-500 text-white"
          }`}
        >
          <Save size={16} />
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-4">
        {category.meals.map((meal) => (
          <MealSlot
            key={`${category.id}-${meal.id}`}
            meal={meal}
            categoryId={category.id}
            onRemoveMeal={onRemoveMeal}
          />
        ))}

        {category.meals.length === 0 && (
          <div className="col-span-1 bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg p-8 flex items-center justify-center text-gray-400 text-sm hover:border-gray-500 transition-colors duration-200">
            {isDragOver ? "Drop here!" : "Drop meals here"}
          </div>
        )}
      </div>
    </div>
  );
};
