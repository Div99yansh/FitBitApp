import React, { useState, useCallback } from "react";
import { useDroppable } from "@dnd-kit/core";
import { Save } from "lucide-react";
import type { WorkoutCategoryProps, Workout } from "../../types";
import { WorkoutSlot } from "./WorkoutSlot";

export const WorkoutCategory: React.FC<WorkoutCategoryProps> = ({
  category,
  onDropWorkout,
  onRemoveWorkout,
  onSaveWorkouts,
  isSaving,
  hasChanges,
}) => {
  const [isNativeDragOver, setIsNativeDragOver] = useState(false);

  const { isOver, setNodeRef } = useDroppable({
    id: `workout-category-${category.id}`,
    data: { categoryId: category.id, type: "workout-category" },
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

      const workoutData = e.dataTransfer.getData("application/json");
      if (workoutData) {
        try {
          const workout = JSON.parse(workoutData) as Workout;
          onDropWorkout(category.id, workout);
        } catch (err) {
          console.error("Failed to parse workout data:", err);
        }
      }
    },
    [category.id, onDropWorkout]
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
          />
        ))}

        {category.workouts.length === 0 && (
          <div className="col-span-1 bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg p-8 flex items-center justify-center text-gray-400 text-sm hover:border-gray-500 transition-colors duration-200">
            {isDragOver ? "Drop here!" : "Drop workouts here"}
          </div>
        )}
      </div>
    </div>
  );
};
