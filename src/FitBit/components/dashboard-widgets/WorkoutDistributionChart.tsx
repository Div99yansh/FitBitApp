import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts";
import type { WorkoutBreakdown } from "../../types";

interface WorkoutDistributionChartProps {
  breakdown: {
    upperBody: WorkoutBreakdown;
    lowerBody: WorkoutBreakdown;
    core: WorkoutBreakdown;
    fullBody: WorkoutBreakdown;
  };
}

const COLORS = {
  upperBody: "#3B82F6",
  lowerBody: "#22C55E",
  core: "#F59E0B",
  fullBody: "#8B5CF6",
};

export const WorkoutDistributionChart: React.FC<
  WorkoutDistributionChartProps
> = ({ breakdown }) => {
  const data = [
    {
      name: "Upper",
      reps: breakdown.upperBody.reps,
      duration: breakdown.upperBody.duration,
      fill: COLORS.upperBody,
    },
    {
      name: "Lower",
      reps: breakdown.lowerBody.reps,
      duration: breakdown.lowerBody.duration,
      fill: COLORS.lowerBody,
    },
    {
      name: "Core",
      reps: breakdown.core.reps,
      duration: breakdown.core.duration,
      fill: COLORS.core,
    },
    {
      name: "Full",
      reps: breakdown.fullBody.reps,
      duration: breakdown.fullBody.duration,
      fill: COLORS.fullBody,
    },
  ];

  const hasData = data.some((d) => d.reps > 0 || d.duration > 0);

  if (!hasData) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl border border-gray-700/50">
        <h3 className="text-white font-semibold mb-4">Muscle Groups</h3>
        <div className="h-40 flex items-center justify-center">
          <p className="text-gray-500 text-sm">No workouts logged today</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl border border-gray-700/50">
      <h3 className="text-white font-semibold mb-4">Muscle Groups</h3>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={28}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 11 }}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid rgba(75, 85, 99, 0.5)",
                borderRadius: "12px",
                color: "#fff",
                boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
              }}
              formatter={(value, name) => [
                name === "reps" ? `${value} reps` : `${value} min`,
                name === "reps" ? "Reps" : "Duration",
              ]}
            />
            <Bar dataKey="reps" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.fill}
                  style={{
                    filter: `drop-shadow(0 0 6px ${entry.fill}40)`
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
