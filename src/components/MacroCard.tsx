import type { LucideIcon } from "lucide-react";
import React from "react";

interface MacroCardProps {
  title: string;
  icon: LucideIcon;
  current: number;
  goal: number;
  type: string;
}

const barColorClasses: Record<string, string> = {
  calories: "bg-red-500",
  protein: "bg-purple-400",
  carbs: "bg-blue-500",
  fats: "bg-amber-400",
};

const bgColorClasses: Record<string, string> = {
  calories: "bg-red-100",
  protein: "bg-purple-100",
  carbs: "bg-blue-100",
  fats: "bg-amber-100",
};

const iconColorClasses: Record<string, string> = {
  calories: "text-red-500",
  protein: "text-purple-400",
  carbs: "text-blue-500",
  fats: "text-amber-400",
};

const textColorClasses: Record<string, string> = {
  calories: "text-red-700",
  protein: "text-purple-600",
  carbs: "text-blue-700",
  fats: "text-amber-600",
};

const MacroCard = ({
  title,
  icon: Icon,
  current,
  goal,
  type,
}: MacroCardProps) => {
  const percentage = Math.min((current / goal) * 100, 100);

  return (
    <div
      className={`rounded-2xl shadow-md p-6 min-h-40 w-full flex flex-col justify-between ${bgColorClasses[type]}`}
    >
      <div className="flex justify-between items-center">
        <p className="text-lg font-semibold text-gray-700">{title}</p>
        <Icon className={`w-8 h-8 ${iconColorClasses[type]}`} />
      </div>
      <div>
        <p className={`text-lg font-bold mt-2 ${textColorClasses[type]}`}>
          {current}/{goal}
        </p>
        <div className="w-full h-3 mt-3 bg-white rounded-full overflow-hidden">
          <div
            className={`${barColorClasses[type]} h-full transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default MacroCard;
