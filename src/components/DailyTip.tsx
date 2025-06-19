import React from "react";
import dailyTips from "../data/dailyTips";
import { Lightbulb } from "lucide-react";

const DailyTip = () => {
  const index =
    dailyTips.length > 0 ? new Date().getDate() % dailyTips.length : 0;
  const tip = dailyTips.length > 0 ? dailyTips[index] : "No tips available";

  return (
    <div className="flex flex-row justify-center items-center p-4 bg-white rounded-2xl shadow-lg gap-2">
      <Lightbulb className="text-amber-500" />
      <p className="text-sm md:text-base font-medium text-gray-800">{tip}</p>
    </div>
  );
};

export default DailyTip;
