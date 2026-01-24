import React, { useEffect, useCallback, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import type { WorkoutItemProps } from "../../types";
import { useIsTouchDevice } from "../../hooks";

export const WorkoutItem: React.FC<WorkoutItemProps> = ({
  workout,
  onDragStart,
  isFromList = false,
}) => {
  const isTouchDevice = useIsTouchDevice();
  const [isNativeDragging, setIsNativeDragging] = useState(false);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `workout-${workout.id}`,
    data: { workout, type: "workout" },
  });

  // Notify parent when drag starts (for dnd-kit on touch)
  useEffect(() => {
    if (isDragging) {
      onDragStart(workout);
    }
  }, [isDragging, workout, onDragStart]);

  // Native HTML5 drag start handler for desktop
  const handleNativeDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.dataTransfer.setData("application/json", JSON.stringify(workout));
      e.dataTransfer.setData("text/workout-id", workout.id);
      e.dataTransfer.effectAllowed = "move";
      setIsNativeDragging(true);
      onDragStart(workout);
    },
    [workout, onDragStart]
  );

  const handleNativeDragEnd = useCallback(() => {
    setIsNativeDragging(false);
  }, []);

  const formatWorkoutInfo = () => {
    const parts = [];
    parts.push(`${workout.reps} reps`);
    parts.push(`${workout.duration} min`);
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
      <div className="font-medium text-white text-sm mb-2">{workout.name}</div>
      <div className="text-gray-300 text-xs">{formatWorkoutInfo()}</div>
    </div>
  );
};
