import React from "react";
import TodaySummaryItem from "./TodaySummaryItem";
import MacroPieChart from "./MacroPieChart";

interface TodaySummaryProps {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  goalCalories: number;
  goalProtein: number;
  goalCarbs: number;
  goalFats: number;
}

const TodaySummary: React.FC<TodaySummaryProps> = ({
  calories,
  protein,
  carbs,
  fats,
  goalCalories,
  goalProtein,
  goalCarbs,
  goalFats,
}) => {
  return (
    <div className="bg-white shadow-md rounded-xl justify-center items-center p-2 w-full">
      <h2 className="text-lg font-semibold">Today's summary</h2>
      <div className="flex flex-row justify-between gap-4">
        <TodaySummaryItem
          title="calories"
          value={calories}
          goal={goalCalories}
        />
        <TodaySummaryItem title="protein" value={protein} goal={goalProtein} />
        <TodaySummaryItem title="carbs" value={carbs} goal={goalCarbs} />
        <TodaySummaryItem title="fats" value={fats} goal={goalFats} />
      </div>
      <div className="w-full flex justify-center items-center">
        <MacroPieChart protein={protein} carbs={carbs} fats={fats} />
      </div>
    </div>
  );
};

export default TodaySummary;
