import { useState, useCallback } from "react";
import type { Workout } from "../types";

export const useWorkoutDragDrop = () => {
  const [draggedWorkout, setDraggedWorkout] = useState<Workout | null>(null);

  const handleDragStart = useCallback((workout: Workout) => {
    setDraggedWorkout(workout);
  }, []);

  return { draggedWorkout, handleDragStart };
};
