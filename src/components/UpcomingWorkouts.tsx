import React from "react";
import UpcomingWorkoutItem from "./UpcomingWorkoutItem";
import { Dumbbell } from "lucide-react";
import { type UpcomingWorkoutItemProps } from "./UpcomingWorkoutItem";

interface UpcomingWorkoutProps {
  workouts: UpcomingWorkoutItemProps[];
}

const UpcomingWorkouts: React.FC<UpcomingWorkoutProps> = ({ workouts }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-3xl flex flex-col justify-between">
      <div>
        <div className="flex flex-row justify-between items-center mb-2">
          <h2 className="text-xl font-semibold mb-2">Upcoming workouts</h2>
          <Dumbbell className="w-8 h-8 text-indigo-500 rotate-90" />
        </div>
        <div className="flex flex-col gap-4">
          {workouts.map((workout, index) => (
            <UpcomingWorkoutItem
              key={workout.title + workout.nextTraining + index}
              id={workout.id}
              title={workout.title}
              nextTraining={workout.nextTraining}
            />
          ))}
        </div>
      </div>
      <button className="w-full bg-indigo-200 p-3 rounded-xl mt-4">
        <p className="text-center text-indigo-600 font-semibold text-lg">
          View all workouts
        </p>
      </button>
    </div>
  );
};

export default UpcomingWorkouts;
