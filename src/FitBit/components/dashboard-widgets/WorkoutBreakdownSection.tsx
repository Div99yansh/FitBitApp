import React from "react";
import { WorkoutDistributionChart } from "./WorkoutDistributionChart";
import { WorkoutTimeline } from "./WorkoutTimeline";
import type { WorkoutBreakdown, Workout } from "../../types";

interface WorkoutBreakdownSectionProps {
  breakdown: {
    upperBody: WorkoutBreakdown;
    lowerBody: WorkoutBreakdown;
    core: WorkoutBreakdown;
    fullBody: WorkoutBreakdown;
  };
  allWorkouts: Array<Workout & { category: string }>;
}

export const WorkoutBreakdownSection: React.FC<WorkoutBreakdownSectionProps> = ({
  breakdown,
  allWorkouts,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <WorkoutDistributionChart breakdown={breakdown} />
      <WorkoutTimeline workouts={allWorkouts} />
    </div>
  );
};
