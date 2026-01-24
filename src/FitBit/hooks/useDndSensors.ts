import {
  useSensor,
  useSensors,
  TouchSensor,
  KeyboardSensor,
} from "@dnd-kit/core";

export const useDndSensors = () => {
  // Only use TouchSensor for mobile - desktop uses native HTML5 drag-and-drop
  return useSensors(
    useSensor(TouchSensor, {
      // Touch sensor for mobile with delay to distinguish from scroll
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );
};
