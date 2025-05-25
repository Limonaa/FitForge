import React from "react";
import { Pencil, CalendarCheck, ClipboardCheck } from "lucide-react";

interface TrainingCardProps {
  title: string;
  nextTraining: string;
  lastDone: string;
}

const TrainingCard: React.FC<TrainingCardProps> = ({
  title,
  nextTraining,
  lastDone,
}) => {
  return (
    <div className="min-w-96 max-w-md bg-white rounded-2xl shadow-lg p-6">
      <div className="flex flex-col items-center justify-between">
        <div className="flex flex-row justify-between items-center w-full">
          <p className="text-2xl font-semibold first-letter:capitalize">
            {title}
          </p>
          <Pencil className="text-blue-500 cursor-pointer hover:text-blue-600 transition" />
        </div>
        <div className="flex flex-row items-center justify-start w-full mt-4">
          <CalendarCheck className="text-blue-500 mr-2" />
          <p className="first-letter:capitalize">Planned for: {nextTraining}</p>
        </div>
        <div className="flex flex-row items-center justify-start w-full mt-4">
          <ClipboardCheck className="text-blue-500 mr-2" />
          <p className="first-letter:capitalize">Last done: {lastDone}</p>
        </div>
      </div>
    </div>
  );
};

export default TrainingCard;
