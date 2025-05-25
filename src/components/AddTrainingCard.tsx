import React from "react";
import { Pencil, CalendarCheck, ClipboardCheck } from "lucide-react";

const AddTrainingCard = () => {
  return (
    <div className="min-w-96 max-w-md bg-gray-200 rounded-2xl shadow-lg p-6">
      <div className="flex flex-col items-center justify-center h-full w-full">
        <p className="text-gray-400 text-2xl font-semibold">Add new training</p>
        <p className="text-gray-400 text-2xl font-semibold">+</p>
      </div>
    </div>
  );
};

export default AddTrainingCard;
