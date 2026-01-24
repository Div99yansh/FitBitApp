import React from "react";
import { X } from "lucide-react";
import type { WorkoutSlotProps } from "../../types";

export const WorkoutSlot: React.FC<WorkoutSlotProps> = ({
  workout,
  categoryId,
  onRemoveWorkout,
}) => {
  const formatWorkoutInfo = () => {
    const parts = [];
    parts.push(`${workout.reps} reps`);
    parts.push(`${workout.duration} min`);
    return parts.join(" • ");
  };

  return (
    <div className="relative group">
      <div className="relative">
        {/* Static display - not draggable */}
        <div className="bg-gray-700 rounded-lg p-3 border border-gray-600">
          <div className="font-medium text-white text-sm mb-2">{workout.name}</div>
          <div className="text-gray-300 text-xs">{formatWorkoutInfo()}</div>
        </div>
        <button
          onClick={() => onRemoveWorkout(categoryId, workout.id)}
          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
};
