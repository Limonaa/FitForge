import React, { useState } from "react";
import NotificationCard from "../components/NotificationCard";
import MyWorkouts from "../components/MyWorkouts";
import UpcomingWorkouts from "../components/UpcomingWorkouts";
import { useTrainings } from "../hooks/useTrainings";
import AddWorkoutDialog from "../components/AddWorkoutDialog";

const WorkoutsPage = () => {
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const trainingsWithState = useTrainings();
  const trainings = trainingsWithState.map(
    ({ loading, error, ...rest }) => rest
  );

  const [openNewWorkout, setOpenNewWorkout] = useState(false);

  const handleOpenDialog = () => {
    setOpenNewWorkout(true);
  };

  const handleCloseDialog = () => {
    setOpenNewWorkout(false);
  };

  const handleSuccess = () => {
    handleCloseDialog();
  };

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
        {openNewWorkout && (
          <AddWorkoutDialog
            isOpen={true}
            onClose={handleCloseDialog}
            onSuccess={handleSuccess}
          />
        )}
        <div className="flex flex-col items-start justify-center">
          <div className="flex justify-between w-full">
            <div>
              <p className="text-3xl font-bold tracking-wide w-full mb-2">
                Workout planner
              </p>
              <p className="text-sm text-gray-500">
                Plan and schedule your workouts
              </p>
            </div>
            <button
              className="bg-indigo-600 text-white font-semibold text-lg px-4 h-min py-2 rounded-xl"
              onClick={() => handleOpenDialog()}
            >
              New workout
            </button>
          </div>

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
