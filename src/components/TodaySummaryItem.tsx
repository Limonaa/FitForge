import React from "react";

interface TodaySummaryItemProps {
  title: string;
  value: number;
  goal: number;
}

const TodaySummaryItem: React.FC<TodaySummaryItemProps> = ({
  title,
  value,
  goal,
}) => {
  const bgColor = () => {
    switch (title) {
      case "calories":
        return "bg-orange-100";
      case "protein":
        return "bg-purple-100";
      case "carbs":
        return "bg-blue-100";
      case "fats":
        return "bg-amber-100";
    }
  };

  return (
    <div
      className={`${bgColor()} flex flex-col justify-between items-start gap-1 p-4 rounded-lg w-full`}
    >
      <p className="first-letter:capitalize">{title}</p>
      {title == "calories" ? (
        <p className="text-lg font-bold">{value}</p>
      ) : (
        <p className="text-lg font-bold">{value}g</p>
      )}
      {title == "calories" ? (
        <p className="text-gray-500">of {goal}</p>
      ) : (
        <p className="text-gray-500">of {goal}g</p>
      )}
    </div>
  );
};

export default TodaySummaryItem;
