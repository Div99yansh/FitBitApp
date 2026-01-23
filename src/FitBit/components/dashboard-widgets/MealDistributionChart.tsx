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

interface MealDistributionChartProps {
  breakfast: number;
  lunch: number;
  dinner: number;
}

const COLORS = {
  breakfast: "#F59E0B",
  lunch: "#3B82F6",
  dinner: "#8B5CF6",
};

export const MealDistributionChart: React.FC<MealDistributionChartProps> = ({
  breakfast,
  lunch,
  dinner,
}) => {
  const data = [
    { name: "Breakfast", calories: breakfast, fill: COLORS.breakfast },
    { name: "Lunch", calories: lunch, fill: COLORS.lunch },
    { name: "Dinner", calories: dinner, fill: COLORS.dinner },
  ];

  const total = breakfast + lunch + dinner;

  if (total === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl border border-gray-700/50">
        <h3 className="text-white font-semibold mb-4">Meal Distribution</h3>
        <div className="h-32 flex items-center justify-center">
          <p className="text-gray-500 text-sm">No meals logged today</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl border border-gray-700/50">
      <h3 className="text-white font-semibold mb-4">Meal Distribution</h3>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" barSize={20}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              width={70}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid rgba(75, 85, 99, 0.5)",
                borderRadius: "12px",
                color: "#fff",
                boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
              }}
              formatter={(value) => [`${value} kcal`, "Calories"]}
            />
            <Bar dataKey="calories" radius={[0, 6, 6, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.fill}
                  style={{
                    filter: `drop-shadow(0 0 4px ${entry.fill}30)`
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between mt-4 text-sm">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor: item.fill,
                boxShadow: `0 0 8px ${item.fill}50`
              }}
            />
            <span className="text-gray-400">
              {item.calories > 0
                ? `${((item.calories / total) * 100).toFixed(0)}%`
                : "0%"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
