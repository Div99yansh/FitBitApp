import React from "react";
import type { WorkoutItemProps } from "../../types";

export const WorkoutItem: React.FC<WorkoutItemProps> = ({
  workout,
  onDragStart,
  isFromList = false,
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(workout);
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("application/json", JSON.stringify(workout));
  };

  const formatWorkoutInfo = () => {
    const parts = [];
    parts.push(`${workout.reps} reps`);
    parts.push(`${workout.duration} min`);
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
      <div className="font-medium text-white text-sm mb-2">{workout.name}</div>
      <div className="text-gray-300 text-xs">{formatWorkoutInfo()}</div>
    </div>
  );
};
