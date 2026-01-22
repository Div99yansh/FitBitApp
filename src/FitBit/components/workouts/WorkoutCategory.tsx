import React, { useState } from "react";
import { Save } from "lucide-react";
import type { WorkoutCategoryProps } from "../../types";
import { WorkoutSlot } from "./WorkoutSlot";

export const WorkoutCategory: React.FC<WorkoutCategoryProps> = ({
  category,
  onDropWorkout,
  onRemoveWorkout,
  onDragStart,
  onSaveWorkouts,
  isSaving,
  hasChanges,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const workoutData = e.dataTransfer.getData("application/json");
    if (workoutData) {
      const workout = JSON.parse(workoutData);
      onDropWorkout(category.id, workout);
    }
  };

  return (
    <div
      className={`bg-gray-800 rounded-xl p-4 transition-all duration-300 min-h-[200px] relative ${
        isDragOver ? "ring-2 ring-blue-400 bg-gray-700" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-semibold text-lg">{category.name}</h3>
        <button
          onClick={() => onSaveWorkouts(category.id)}
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
        {category.workouts.map((workout) => (
          <WorkoutSlot
            key={`${category.id}-${workout.id}`}
            workout={workout}
            categoryId={category.id}
            onRemoveWorkout={onRemoveWorkout}
            onDragStart={onDragStart}
          />
        ))}

        {category.workouts.length === 0 && (
          <div className="col-span-1 bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg p-8 flex items-center justify-center text-gray-400 text-sm hover:border-gray-500 transition-colors duration-200">
            Drop workouts here
          </div>
        )}
      </div>
    </div>
  );
};
