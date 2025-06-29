import React, { useState } from "react";
import NotificationCard from "../components/NotificationCard";
import MyWorkouts from "../components/MyWorkouts";
import UpcomingWorkouts from "../components/UpcomingWorkouts";
import { useTrainings } from "../hooks/useTrainings";
import AddWorkoutDialog from "../components/AddWorkoutDialog";
import Button from "../components/Button";
import { CirclePlus } from "lucide-react";

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
            <p className="text-2xl md:text-3xl font-bold tracking-wide mb-1 sm:mb-2">
              Workout planner
            </p>
            <p className="text-sm text-gray-500">
              Plan and schedule your workouts
            </p>
          </div>
          <Button
            variant="primary"
            className=""
            onClick={() => handleOpenDialog()}
          >
            New workout
          </Button>
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
