import React from "react";
import Button from "./Button";

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
      <Button
        variant="amber"
        onClick={onPrev}
        disabled={currentIndex === 0}
        size="lg"
      >
        Prev
      </Button>
      <Button
        variant="secondary"
        onClick={onSkip}
        disabled={currentIndex >= totalExercises - 1}
        size="lg"
      >
        Skip
      </Button>
      <Button
        variant="primary"
        onClick={onNext}
        disabled={currentIndex >= totalExercises - 1}
        size="lg"
      >
        Next
      </Button>
      <Button variant="red" onClick={onFinish} size="lg">
        End
      </Button>
    </div>
  );
};

export default WorkoutButtons;
