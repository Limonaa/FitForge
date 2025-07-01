import React from "react";

export interface UpcomingWorkoutItemProps {
  id: number;
  title: string;
  nextTraining: string;
  onClick: () => void;
}

const UpcomingWorkoutItem: React.FC<UpcomingWorkoutItemProps> = ({
  id,
  title,
  nextTraining,
  onClick,
}) => {
  function convertDotDateToISO(dotDate: string): string {
    const [day, month, year] = dotDate.split(".");
    return `${year}-${month}-${day}`;
  }

  const today = new Date().toISOString().slice(0, 10);
  const bColor =
    convertDotDateToISO(nextTraining) == today
      ? "border-blue-500 bg-blue-50"
      : "border-gray-300 bg-white";

  return (
    <div
      className={` px-4 py-2 w-full max-w-3xl flex flex-col border-l-4 ${bColor} rounded-l-sm rounded-r-md hover:cursor-pointer`}
      onClick={onClick}
    >
      <p className="text-lg">{title}</p>
      <p className="text-gray-500">{nextTraining}</p>
    </div>
  );
};

export default UpcomingWorkoutItem;
