import React from "react";
import { Clock, Repeat } from "lucide-react";
import type { Workout } from "../../types";

interface WorkoutTimelineProps {
  workouts: Array<Workout & { category: string }>;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Upper Body": "#3B82F6",
  "Lower Body": "#22C55E",
  Core: "#F59E0B",
  "Full Body": "#8B5CF6",
};

export const WorkoutTimeline: React.FC<WorkoutTimelineProps> = ({
  workouts,
}) => {
  if (workouts.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 h-full shadow-xl border border-gray-700/50">
        <h3 className="text-white font-semibold mb-4">Today's Workouts</h3>
        <div className="flex items-center justify-center h-32">
          <p className="text-gray-500 text-sm">No workouts completed today</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 h-full shadow-xl border border-gray-700/50">
      <h3 className="text-white font-semibold mb-4">Today's Workouts</h3>
      <div className="space-y-3 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
        {workouts.map((workout, index) => (
          <div
            key={`${workout.id}-${index}`}
            className="flex items-center gap-3 bg-gray-800/60 backdrop-blur-sm rounded-xl p-3 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300"
          >
            <div
              className="w-1 h-10 rounded-full"
              style={{
                backgroundColor: CATEGORY_COLORS[workout.category] || "#6B7280",
                boxShadow: `0 0 10px ${CATEGORY_COLORS[workout.category]}50`
              }}
            />
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{workout.name}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-gray-400 text-xs">
                  <Repeat size={12} />
                  {workout.reps} reps
                </span>
                <span className="flex items-center gap-1 text-gray-400 text-xs">
                  <Clock size={12} />
                  {workout.duration} min
                </span>
              </div>
            </div>
            <span
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{
                backgroundColor: `${CATEGORY_COLORS[workout.category]}15`,
                color: CATEGORY_COLORS[workout.category],
                boxShadow: `0 0 10px ${CATEGORY_COLORS[workout.category]}10`
              }}
            >
              {workout.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
