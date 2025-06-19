import React from "react";
import MacroCard from "./MacroCard";
import { Beef, Croissant, Flame, Hamburger } from "lucide-react";

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
    <div className="bg-white shadow-md rounded-xl justify-center items-center p-2 w-full border-t-2">
      <h2 className="text-lg font-semibold mb-2">Today's summary</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 w-full">
        <MacroCard
          title="Calories"
          icon={Flame}
          current={calories}
          goal={goalCalories}
          type="calories"
        />
        <MacroCard
          title="Protein"
          icon={Beef}
          current={protein}
          goal={goalProtein}
          type="protein"
        />
        <MacroCard
          title="Carbs"
          icon={Croissant}
          current={carbs}
          goal={goalCarbs}
          type="carbs"
        />
        <MacroCard
          title="Fats"
          icon={Hamburger}
          current={fats}
          goal={goalFats}
          type="fats"
        />
      </div>
    </div>
  );
};

export default TodaySummary;
