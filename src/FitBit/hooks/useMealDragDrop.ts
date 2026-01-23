import { useState, useCallback } from "react";
import type { Meal } from "../types";

export const useMealDragDrop = () => {
  const [draggedMeal, setDraggedMeal] = useState<Meal | null>(null);

  const handleDragStart = useCallback((meal: Meal) => {
    setDraggedMeal(meal);
  }, []);

  return { draggedMeal, handleDragStart };
};
