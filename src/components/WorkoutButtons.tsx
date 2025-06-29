import React from "react";

interface WorkoutButtonsProps {
  currentIndex: number;
  totalExercises: number;
  onPrev: () => void;
  onSkip: () => void;
  onNext: () => void;
  onFinish: () => void;
}

const WorkoutButtons: React.FC<WorkoutButtonsProps> = ({
  currentIndex,
  totalExercises,
  onPrev,
  onSkip,
  onNext,
  onFinish,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <button
        onClick={onPrev}
        disabled={currentIndex === 0}
        className="py-3 rounded-xl font-medium transition-colors duration-300 ease-in-out
          bg-amber-500 text-white
          disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        Prev
      </button>

      <button
        onClick={onSkip}
        disabled={currentIndex >= totalExercises - 1}
        className="text-sm py-3 rounded-xl font-medium transition-colors duration-300 ease-in-out
          bg-gray-400 text-white
          disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        Skip
      </button>

      <button
        onClick={onNext}
        disabled={currentIndex >= totalExercises - 1}
        className="text-sm py-3 rounded-xl font-medium transition-colors duration-300 ease-in-out
          bg-blue-600 text-white
          disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        Next
      </button>

      <button
        onClick={onFinish}
        className="bg-red-500 text-white text-sm py-3 rounded-xl font-medium"
      >
        End
      </button>
    </div>
  );
};

export default WorkoutButtons;
