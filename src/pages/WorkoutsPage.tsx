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

  const trainingsWithState = useTrainings(4);
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
        <div className="flex flex-col md:flex-row md:justify-between w-full gap-4 mb-4">
          <div>
            <p className="text-2xl md:text-3xl font-bold tracking-wide mb-1">
              Workout planner
            </p>
            <p className="text-sm text-gray-500">
              Plan and schedule your workouts
            </p>
          </div>
          <button
            className="bg-indigo-600 text-white font-semibold text-base md:text-lg px-4 h-min py-2 rounded-xl w-full md:w-auto"
            onClick={() => handleOpenDialog()}
          >
            New workout
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6 w-full">
          <div className="w-full md:flex-[3]">
            <MyWorkouts />
          </div>
          <div className="w-full md:flex-[2]">
            <UpcomingWorkouts
              workouts={trainings.map((training) => ({
                ...training,
                onClick: () => {},
              }))}
              showButton={false}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkoutsPage;
