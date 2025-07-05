import type { LucideIcon } from "lucide-react";
import React from "react";

interface WorkoutDetailsCardProps {
  type: string;
  icon: LucideIcon;
  title: string;
  value: string | number;
  unit?: string | null;
}

const bgColorClasses: Record<string, string> = {
  weight: "bg-amber-100",
  reps: "bg-blue-100",
  sets: "bg-green-100",
  time: "bg-red-100",
};

const iconColorClasses: Record<string, string> = {
  weight: "text-amber-600",
  reps: "text-blue-700",
  sets: "text-green-700",
  time: "text-red-700",
};

const textColorClasses: Record<string, string> = {
  weight: "text-amber-600",
  reps: "text-blue-700",
  sets: "text-green-700",
  time: "text-red-700",
};

const WorkoutDetailsCard: React.FC<WorkoutDetailsCardProps> = ({
  type,
  title,
  icon: Icon,
  value,
  unit = null,
}) => {
  return (
    <div
      className={`rounded-2xl shadow-md p-4 sm:p-6 min-h-24 sm:min-h-36 w-full flex flex-col justify-between ${bgColorClasses[type]}`}
    >
      <div className="flex justify-between items-center">
        <p className="text-xl font-semibold text-gray-700">{title}</p>
        <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${iconColorClasses[type]}`} />
      </div>
      <div
        className={`flex items-end gap-1 text-3xl justify-center font-bold ${textColorClasses[type]}`}
      >
        <p className="mt-2">{value}</p>
        {unit && <p>{unit}</p>}
      </div>
    </div>
  );
};

export default WorkoutDetailsCard;
