import React from "react";
import type { WorkoutListProps } from "../../types";
import { WorkoutItem } from "./WorkoutItem";

export const WorkoutList: React.FC<WorkoutListProps> = ({
  workouts,
  searchTerm,
  onDragStart,
  isAddingWorkout = false,
}) => {
  const filteredWorkouts = workouts.filter((workout) =>
    workout.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-3">
      {isAddingWorkout && (
        <div className="bg-gray-700 rounded-lg p-3 border-l-4 border-blue-400 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-300 text-sm">Adding new workout...</span>
          </div>
        </div>
      )}

      {filteredWorkouts.map((workout, index) => (
        <div
          key={workout.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <WorkoutItem workout={workout} onDragStart={onDragStart} isFromList />
        </div>
      ))}
    </div>
  );
};
