import React from "react";
import { Dumbbell, Repeat, Clock } from "lucide-react";

interface WorkoutSummarySectionProps {
  totalWorkouts: number;
  totalReps: number;
  totalDuration: number;
}

export const WorkoutSummarySection: React.FC<WorkoutSummarySectionProps> = ({
  totalWorkouts,
  totalReps,
  totalDuration,
}) => {
  const cards = [
    {
      icon: Dumbbell,
      value: totalWorkouts,
      label: "Workouts",
      color: "#3B82F6",
    },
    {
      icon: Repeat,
      value: totalReps,
      label: "Total Reps",
      color: "#22C55E",
    },
    {
      icon: Clock,
      value: totalDuration,
      label: "Minutes",
      color: "#8B5CF6",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 flex flex-col items-center shadow-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{
              backgroundColor: `${card.color}15`,
              boxShadow: `0 0 30px ${card.color}20`
            }}
          >
            <card.icon size={26} style={{ color: card.color }} />
          </div>
          <p
            className="text-3xl font-bold mb-1"
            style={{ color: card.color }}
          >
            {card.value}
          </p>
          <p className="text-gray-400 text-sm font-medium">{card.label}</p>
        </div>
      ))}
    </div>
  );
};
