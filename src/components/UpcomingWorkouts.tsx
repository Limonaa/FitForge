import React, { useState } from "react";
import UpcomingWorkoutItem from "./UpcomingWorkoutItem";
import { Dumbbell } from "lucide-react";
import { type UpcomingWorkoutItemProps } from "./UpcomingWorkoutItem";
import { useNavigate } from "react-router-dom";
import StartEditWorkoutDialog from "./StartEditWorkoutDialog";

interface UpcomingWorkoutProps {
  workouts: UpcomingWorkoutItemProps[];
  showButton: boolean;
}

const UpcomingWorkouts: React.FC<UpcomingWorkoutProps> = ({
  workouts,
  showButton,
}) => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [clickedId, setClickedId] = useState(0);
  const [clickedTitle, setClickedTitle] = useState("");

  const handleOpenWorkoutDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      {openDialog && (
        <StartEditWorkoutDialog
          isOpen={true}
          onClose={handleCloseDialog}
          id={clickedId}
          title={clickedTitle}
        />
      )}
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-3xl flex flex-col justify-between h-full">
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
                onClick={() => {
                  setClickedId(workout.id);
                  setClickedTitle(workout.title);
                  handleOpenWorkoutDialog();
                }}
              />
            ))}
          </div>
        </div>
        {showButton && (
          <button
            className="w-full bg-indigo-200 p-3 rounded-xl mt-4"
            onClick={() => navigate("/workouts")}
          >
            <p className="text-center text-indigo-600 font-semibold text-lg">
              View all workouts
            </p>
          </button>
        )}
      </div>
    </>
  );
};

export default UpcomingWorkouts;
