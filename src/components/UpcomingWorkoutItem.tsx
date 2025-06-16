import React from "react";

export interface UpcomingWorkoutItemProps {
  id: number;
  title: string;
  nextTraining: string;
}

const UpcomingWorkoutItem: React.FC<UpcomingWorkoutItemProps> = ({
  title,
  nextTraining,
}) => {
  function convertDotDateToISO(dotDate: string): string {
    const [day, month, year] = dotDate.split(".");
    return `${year}-${month}-${day}`;
  }

  const today = new Date().toISOString().slice(0, 10);
  const bColor =
    convertDotDateToISO(nextTraining) == today
      ? "border-blue-500"
      : "border-gray-300";

  return (
    <div
      className={`bg-white px-4 py-2 w-full max-w-3xl flex flex-col border-l-4 ${bColor} rounded-sm`}
    >
      <p className="text-lg">{title}</p>
      <p className="text-gray-500">{nextTraining}</p>
    </div>
  );
};

export default UpcomingWorkoutItem;
