import React from "react";
import { Lightbulb } from "lucide-react";
import { useDailyTip } from "../hooks/useDailyTip";

const DailyTip = () => {
  const { tip, loading } = useDailyTip();

  if (loading)
    return (
      <div className="flex flex-row justify-center items-center p-4 bg-white rounded-2xl shadow-lg gap-2">
        <Lightbulb className="text-amber-500" />
        <p className="text-sm md:text-base font-medium text-gray-800">
          Loading tip...
        </p>
        <Lightbulb className="text-amber-500" />
      </div>
    );

  return (
    <div className="flex flex-row justify-center items-center p-4 bg-white rounded-2xl shadow-lg gap-2">
      <Lightbulb className="text-amber-500" />
      <p className="text-sm md:text-base font-medium text-gray-800">
        {tip?.description || "No tips today 🙅‍♂️"}
      </p>
    </div>
  );
};

export default DailyTip;
