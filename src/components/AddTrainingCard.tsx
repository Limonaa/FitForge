import React from "react";

const AddTrainingCard = () => {
  return (
    <button className="min-w-96 max-w-md bg-gray-200 rounded-2xl shadow-lg p-6 hover:cursor-pointer">
      <div className="flex flex-col items-center justify-center h-full w-full">
        <p className="text-gray-400 text-2xl font-semibold">
          Add new training <br /> +
        </p>
      </div>
    </button>
  );
};

export default AddTrainingCard;
