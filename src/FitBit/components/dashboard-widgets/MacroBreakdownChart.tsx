import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface MacroBreakdownChartProps {
  protein: number;
  carbs: number;
  fats: number;
}

const COLORS = {
  protein: "#22C55E",
  carbs: "#F59E0B",
  fats: "#EF4444",
};

export const MacroBreakdownChart: React.FC<MacroBreakdownChartProps> = ({
  protein,
  carbs,
  fats,
}) => {
  const total = protein + carbs + fats;

  const data = [
    {
      name: "Protein",
      value: protein,
      color: COLORS.protein,
      percentage: total > 0 ? ((protein / total) * 100).toFixed(0) : 0,
    },
    {
      name: "Carbs",
      value: carbs,
      color: COLORS.carbs,
      percentage: total > 0 ? ((carbs / total) * 100).toFixed(0) : 0,
    },
    {
      name: "Fats",
      value: fats,
      color: COLORS.fats,
      percentage: total > 0 ? ((fats / total) * 100).toFixed(0) : 0,
    },
  ];

  const renderLegend = () => (
    <div className="flex flex-col gap-3 mt-4">
      {data.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full shadow-sm"
              style={{
                backgroundColor: entry.color,
                boxShadow: `0 0 8px ${entry.color}40`
              }}
            />
            <span className="text-gray-300 text-sm font-medium">
              {entry.name}
            </span>
          </div>
          <span className="text-gray-400 text-sm">
            {entry.value}g <span className="text-gray-500">({entry.percentage}%)</span>
          </span>
        </div>
      ))}
    </div>
  );

  if (total === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl border border-gray-700/50">
        <h3 className="text-white font-semibold mb-4">Macro Breakdown</h3>
        <div className="h-40 flex items-center justify-center">
          <p className="text-gray-500 text-sm">No meal data for today</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl border border-gray-700/50">
      <h3 className="text-white font-semibold mb-4">Macro Breakdown</h3>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={65}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  style={{
                    filter: `drop-shadow(0 0 6px ${entry.color}40)`
                  }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      {renderLegend()}
    </div>
  );
};
