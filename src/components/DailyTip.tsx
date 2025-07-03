import { Lightbulb } from "lucide-react";
import { useDailyTip } from "../hooks/useDailyTip";

const DailyTip = () => {
  const { tip, loading } = useDailyTip();

  if (loading)
    return (
      <div className="flex flex-col sm:flex-row justify-center items-center p-3 sm:p-4 bg-white rounded-2xl shadow-lg gap-2 sm:gap-3 text-center sm:text-left">
        <Lightbulb className="text-amber-500 w-6 h-6" />
        <p className="text-sm sm:text-base font-medium text-gray-800">
          Loading tip...
        </p>
        <Lightbulb className="text-amber-500" />
      </div>
    );

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center p-3 sm:p-4 bg-white rounded-2xl shadow-lg gap-2 sm:gap-3 text-center sm:text-left">
      <Lightbulb className="text-amber-500 w-6 h-6" />
      <p className="text-sm sm:text-base font-medium text-gray-800">
        {tip?.description || "No tips today 🙅‍♂️"}
      </p>
    </div>
  );
};

export default DailyTip;
