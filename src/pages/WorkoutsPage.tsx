import { useEffect, useState } from "react";
import NotificationCard from "../components/NotificationCard";
import MyWorkouts from "../components/MyWorkouts";
import UpcomingWorkouts from "../components/UpcomingWorkouts";
import { useTrainings } from "../hooks/useTrainings";
import AddWorkoutDialog from "../components/AddWorkoutDialog";
import Button from "../components/Button";
import PageHeader from "../components/PageHeader";
import LoadWrapper from "../components/LoadWrapper";

const WorkoutsPage = () => {
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const {
    trainings,
    loading: workoutLoading,
    error: workoutError,
  } = useTrainings(4);

  const [openNewWorkout, setOpenNewWorkout] = useState(false);

  const handleOpenDialog = () => {
    setOpenNewWorkout(true);
  };

  const handleCloseDialog = () => {
    setOpenNewWorkout(false);
  };

  const handleSuccess = () => {
    setNotification({
      message: "Workout added successfully",
      type: "success",
    });
    handleCloseDialog();
  };

  useEffect(() => {
    if (workoutError) {
      setNotification({
        message: workoutError.message || "Failed to fetch workout data",
        type: "error",
      });
    }
  }, [workoutError]);

  return (
    <>
      <LoadWrapper loading={workoutLoading}>
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
            onError={(error) =>
              setNotification({
                message: error?.message || "Failed to add workout",
                type: "error",
              })
            }
          />
        )}
        <PageHeader
          title="Workout planner"
          subtitle="Plan and schedule your workouts"
          rightSlot={
            <Button
              variant="primary"
              className=""
              onClick={() => handleOpenDialog()}
            >
              New workout
            </Button>
          }
        >
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
        </PageHeader>
      </LoadWrapper>
    </>
  );
};

export default WorkoutsPage;
