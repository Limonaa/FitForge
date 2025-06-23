import React, { useState } from "react";
import NotificationCard from "../components/NotificationCard";
import MyWorkouts from "../components/MyWorkouts";
import UpcomingWorkouts from "../components/UpcomingWorkouts";
import { useTrainings } from "../hooks/useTrainings";

const WorkoutsPage = () => {
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const trainingsWithState = useTrainings();
  const trainings = trainingsWithState.map(
    ({ loading, error, ...rest }) => rest
  );

  return (
    <div>
      <>
        {notification && (
          <NotificationCard
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
        <div className="flex flex-col items-start justify-center">
          <p className="text-3xl font-bold tracking-wide w-full mb-2">
            Workout planner
          </p>
          <p className="text-sm text-gray-500">
            Plan and schedule your workouts
          </p>
          <div className="flex flex-row gap-6 w-full">
            <div className="flex-[3]">
              <MyWorkouts />
            </div>
            <div className="flex-[2]">
              <UpcomingWorkouts workouts={trainings} />
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default WorkoutsPage;
