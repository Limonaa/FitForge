import React from "react";
import { Dumbbell, Repeat2, Hash, Weight, X } from "lucide-react";
import { useWorkoutDetails } from "../hooks/useWorkoutDetails";

interface WorkoutDetailsProps {
  workoutId: number;
  onClose: () => void;
}

const WorkoutDetails: React.FC<WorkoutDetailsProps> = ({
  workoutId,
  onClose,
}) => {
  const { exercises, loading, error } = useWorkoutDetails(workoutId);

  const sorted = [...exercises].sort(
    (a, b) => a.orderInWorkout - b.orderInWorkout
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-md space-y-4 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-6 py-4 border z-50 max-w-sx">
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <X className="w-5 h-5" />
      </button>
      <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
        <Dumbbell className="w-5 h-5" />
        Workout Details
      </h2>

      <div className="divide-y divide-gray-200">
        {sorted.map((ex) => (
          <div
            key={ex.id}
            className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <Hash className="w-4 h-4 text-gray-500" />
              <span className="text-gray-800 font-medium truncate">
                {ex.name}
              </span>
            </div>
            <div className="flex gap-4 text-sm text-gray-600 mt-2 sm:mt-0 sm:ml-4">
              <div className="flex items-center gap-1">
                <Repeat2 className="w-4 h-4" />
                {ex.reps} × {ex.sets}
              </div>
              <div className="flex items-center gap-1">
                <Weight className="w-4 h-4" />
                {ex.weight} kg
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutDetails;
