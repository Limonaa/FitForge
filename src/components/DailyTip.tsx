import React from "react";
import dailyTips from "../data/dailyTips";
import { Lightbulb } from "lucide-react";

const DailyTip = () => {
  const index = new Date().getDate() % dailyTips.length;
  const tip = dailyTips[index];

  return (
    <div className="flex flex-col justify-center items-center p-2 bg-white rounded-2xl shadow-lg">
      <Lightbulb className="text-amber-500" />
      <p className="text-sm md:text:base font-medium text-gray-800">{tip}</p>
    </div>
  );
};

export default DailyTip;
