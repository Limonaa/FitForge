import { Calendar, Clock } from "lucide-react";
import React from "react";

interface WorkoutCardProps {
  name: string;
  duration: number;
  date: string;
  onClick: () => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({
  name,
  duration,
  date,
  onClick,
}) => {
  return (
    <div className="p-4 border rounded-lg" onClick={onClick}>
      <div className="flex flex-row justify-between">
        <p className="text-lg font-semibold">{name}</p>
        <div className="bg-indigo-200 flex flex-row gap-3 p-2 rounded-xl text-indigo-600">
          <Calendar className="w-6 h-6" />
          <p className="font-semibold">{date}</p>
        </div>
      </div>
      <div className="flex flex-row gap-2 items-center text-gray-700">
        <Clock className="w-5 h-5" />
        <p>{Math.floor(duration / 60)} min</p>
      </div>
    </div>
  );
};

export default WorkoutCard;
