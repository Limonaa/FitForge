import React from "react";

interface HistoryItemProps {
  name: string;
  date: string;
  duration: number;
  reps: number;
  sets: number;
  onClick: () => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({
  name,
  date,
  duration,
  reps,
  sets,
  onClick,
}) => {
  return (
    <div
      className="w-full grid grid-cols-5 grid-rows-1 py-4 border-b-2 border-gray-400"
      onClick={onClick}
    >
      <p className="font-medium">{name}</p>
      <p className="font-medium text-gray-700">{date}</p>
      <p className="font-medium text-gray-700">
        {Math.floor(duration / 60)} min |{" "}
        {duration - Math.floor(duration / 60) * 60} sec
      </p>
      <p className="font-medium text-gray-700">
        {reps} | {sets}
      </p>
      <p className="font-medium text-blue-500 underline hover:cursor-pointer text-end">
        Details
      </p>
    </div>
  );
};

export default HistoryItem;
