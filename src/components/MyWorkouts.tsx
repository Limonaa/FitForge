import React from "react";
import WorkoutCard from "./WorkoutCard";
import { useTrainings } from "../hooks/useTrainings";

const MyWorkouts = () => {
  const trainingsWithState = useTrainings();
  const trainings = trainingsWithState.map(
    ({ loading, error, ...rest }) => rest
  );
  return (
    <div className="bg-white shadow-md rounded-xl justify-center items-center p-2 w-full">
      <p className="text-2xl font-semibold mb-4">My workouts</p>
      <div className="flex flex-col gap-2">
        {trainings.map((training) => (
          <WorkoutCard
            key={training.id}
            name={training.title}
            duration={training.duration}
            date={training.nextTraining}
            onClick={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default MyWorkouts;
