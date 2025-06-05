import React from "react";

interface MacroProgressProps {
  label: string;
  current: number;
  target: number;
  color: string;
}

const MacroProgress: React.FC<MacroProgressProps> = ({
  label,
  current,
  target,
  color,
}) => {
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <div className="mb-4 w-full">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {label == "Calories" ? (
          <span className="text-sm text-gray-500">
            {current}kcal / {target}kcal
          </span>
        ) : (
          <span className="text-sm text-gray-500">
            {current}g / {target}g
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className={`h-4 rounded-full bg-${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default MacroProgress;
