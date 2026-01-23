import React from "react";
import { SemiCircularGauge } from "./SemiCircularGauge";
import type { DailyGoals } from "../../types";

interface DailyProgressSectionProps {
  totalCalories: number;
  totalDuration: number;
  goals: DailyGoals;
}

export const DailyProgressSection: React.FC<DailyProgressSectionProps> = ({
  totalCalories,
  totalDuration,
  goals,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SemiCircularGauge
        current={totalCalories}
        goal={goals.calorieGoal}
        label="Calories Consumed"
        color="#3B82F6"
        unit="kcal"
      />
      <SemiCircularGauge
        current={totalDuration}
        goal={goals.workoutMinutesGoal}
        label="Workout Time"
        color="#22C55E"
        unit="min"
      />
    </div>
  );
};
