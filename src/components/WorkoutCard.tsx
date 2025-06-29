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
    <div
      className="p-4 border rounded-lg hover:cursor-pointer transition hover:shadow-sm w-full"
      onClick={onClick}
    >
      <div className="flex flex-row justify-between items-center gap-2 sm:gap-0 mb-2">
        <p className="text-lg sm:text-xl font-semibold">{name}</p>
        <div className="bg-indigo-200 flex items-center gap-2 px-3 py-1 rounded-xl text-indigo-600 w-fit text-sm sm:text-base">
          <Calendar className="w-5 h-5" />
          <p className="font-semibold">{date}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-gray-700 text-sm sm:text-base">
        <Clock className="w-4 h-4" />
        <p>{Math.floor(duration / 60)} min</p>
      </div>
    </div>
  );
};

export default WorkoutCard;
