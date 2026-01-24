import React, { useEffect, useCallback, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import type { MealItemProps } from "../../types";
import { useIsTouchDevice } from "../../hooks";

export const MealItem: React.FC<MealItemProps> = ({
  meal,
  onDragStart,
  isFromList = false,
}) => {
  const isTouchDevice = useIsTouchDevice();
  const [isNativeDragging, setIsNativeDragging] = useState(false);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `meal-${meal.id}`,
    data: { meal, type: "meal" },
  });

  // Notify parent when drag starts (for dnd-kit on touch)
  useEffect(() => {
    if (isDragging) {
      onDragStart(meal);
    }
  }, [isDragging, meal, onDragStart]);

  // Native HTML5 drag start handler for desktop
  const handleNativeDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.dataTransfer.setData("application/json", JSON.stringify(meal));
      e.dataTransfer.setData("text/meal-id", meal.id);
      e.dataTransfer.effectAllowed = "move";
      setIsNativeDragging(true);
      onDragStart(meal);
    },
    [meal, onDragStart]
  );

  const handleNativeDragEnd = useCallback(() => {
    setIsNativeDragging(false);
  }, []);

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

  // On touch devices, use dnd-kit listeners; on desktop, use native HTML5 drag
  const dragProps = isTouchDevice
    ? { ...listeners, ...attributes, style: { touchAction: "none" as const } }
    : {
        draggable: true,
        onDragStart: handleNativeDragStart,
        onDragEnd: handleNativeDragEnd,
      };

  const isCurrentlyDragging = isDragging || isNativeDragging;

  return (
    <div
      ref={setNodeRef}
      {...dragProps}
      className={`bg-gray-700 rounded-lg p-3 cursor-grab active:cursor-grabbing transition-colors duration-200 hover:bg-gray-600 hover:shadow-lg select-none ${
        isFromList ? "border-l-4 border-blue-400" : "border border-gray-600"
      } ${isCurrentlyDragging ? "opacity-50" : ""}`}
    >
      <div className="font-medium text-white text-sm mb-2">{meal.name}</div>
      <div className="text-gray-300 text-xs">{formatNutritionInfo()}</div>
    </div>
  );
};
