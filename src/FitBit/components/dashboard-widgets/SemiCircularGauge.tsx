import React from "react";

interface SemiCircularGaugeProps {
  current: number;
  goal: number;
  label: string;
  color: string;
  unit: string;
}

export const SemiCircularGauge: React.FC<SemiCircularGaugeProps> = ({
  current,
  goal,
  label,
  color,
  unit,
}) => {
  const percentage = Math.min((current / goal) * 100, 100);
  const radius = 85;
  const strokeWidth = 14;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const gradientId = `gauge-gradient-${label.replace(/\s+/g, "-")}`;
  const glowId = `gauge-glow-${label.replace(/\s+/g, "-")}`;
  const shadowId = `gauge-shadow-${label.replace(/\s+/g, "-")}`;

  const isComplete = percentage >= 100;
  const statusColor = isComplete ? "#22C55E" : color;

  // Calculate the position for the glowing dot at the end of progress
  const angle = Math.PI - (percentage / 100) * Math.PI;
  const dotX = radius + 10 + normalizedRadius * Math.cos(angle);
  const dotY = radius + 10 - normalizedRadius * Math.sin(angle);

  return (
    <div className="bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900 rounded-2xl p-6 flex flex-col items-center shadow-2xl border border-gray-700/50 relative overflow-hidden">
      {/* Subtle background glow */}
      <div
        className="absolute inset-0 opacity-20 blur-3xl"
        style={{
          background: `radial-gradient(circle at 50% 100%, ${color}30, transparent 70%)`
        }}
      />

      {/* Label */}
      <h3 className="text-gray-400 text-xs font-semibold tracking-widest uppercase mb-6 relative z-10">
        {label}
      </h3>

      {/* SVG Gauge */}
      <div className="relative z-10">
        <svg
          height={radius + 25}
          width={radius * 2 + 20}
        >
          <defs>
            {/* Gradient for the progress arc */}
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} stopOpacity="0.6" />
              <stop offset="50%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor={isComplete ? "#22C55E" : color} stopOpacity="0.8" />
            </linearGradient>

            {/* Glow filter for progress */}
            <filter id={glowId} x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Inner shadow for depth */}
            <filter id={shadowId} x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Outer glow ring */}
          <path
            d={`M ${10 + strokeWidth / 2} ${radius + 10}
                A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${radius * 2 + 10 - strokeWidth / 2} ${radius + 10}`}
            fill="none"
            stroke={`${color}10`}
            strokeWidth={strokeWidth + 20}
            strokeLinecap="round"
          />

          {/* Background track with depth */}
          <path
            d={`M ${10 + strokeWidth / 2} ${radius + 10}
                A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${radius * 2 + 10 - strokeWidth / 2} ${radius + 10}`}
            fill="none"
            stroke="#1a1f2e"
            strokeWidth={strokeWidth + 4}
            strokeLinecap="round"
            filter={`url(#${shadowId})`}
          />

          {/* Track arc */}
          <path
            d={`M ${10 + strokeWidth / 2} ${radius + 10}
                A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${radius * 2 + 10 - strokeWidth / 2} ${radius + 10}`}
            fill="none"
            stroke="#2d3548"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Progress arc with glow */}
          {percentage > 0 && (
            <path
              d={`M ${10 + strokeWidth / 2} ${radius + 10}
                  A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${radius * 2 + 10 - strokeWidth / 2} ${radius + 10}`}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              filter={`url(#${glowId})`}
              style={{
                transition: "stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          )}

          {/* Glowing end dot */}
          {percentage > 2 && (
            <>
              {/* Outer glow */}
              <circle
                cx={dotX}
                cy={dotY}
                r={8}
                fill={statusColor}
                opacity={0.3}
                style={{
                  transition: "all 1s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
              {/* Inner dot */}
              <circle
                cx={dotX}
                cy={dotY}
                r={5}
                fill={statusColor}
                filter={`url(#${glowId})`}
                style={{
                  transition: "all 1s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
              {/* Center highlight */}
              <circle
                cx={dotX}
                cy={dotY}
                r={2}
                fill="#fff"
                opacity={0.8}
                style={{
                  transition: "all 1s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            </>
          )}
        </svg>

        {/* Center value display */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-3">
          <span
            className="text-4xl font-bold tracking-tight drop-shadow-lg"
            style={{
              color: statusColor,
              textShadow: `0 0 30px ${statusColor}40`
            }}
          >
            {current.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Goal text */}
      <div className="mt-5 text-center relative z-10">
        <span className="text-gray-500 text-sm">
          of{" "}
          <span className="text-gray-300 font-semibold">
            {goal.toLocaleString()} {unit}
          </span>
        </span>
      </div>

      {/* Progress badge */}
      <div
        className="mt-4 px-5 py-2 rounded-full text-sm font-semibold relative z-10"
        style={{
          backgroundColor: `${statusColor}12`,
          color: statusColor,
          boxShadow: `0 0 20px ${statusColor}15, inset 0 0 20px ${statusColor}05`
        }}
      >
        {isComplete ? "Goal Reached!" : `${percentage.toFixed(0)}% Complete`}
      </div>
    </div>
  );
};
