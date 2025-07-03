import React, { useEffect, useState } from "react";
import WorkoutCard from "./WorkoutCard";
import { supabase } from "../services/supabaseService";
import StartEditWorkoutDialog from "./StartEditWorkoutDialog";
import { useUser } from "../context/UserContext";
import NotificationCard from "./NotificationCard";

const ITEMS_PER_PAGE = 3;

interface Training {
  id: number;
  title: string;
  nextWorkout: string;
  duration: number;
}

const MyWorkouts = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [clickedId, setClickedId] = useState(0);
  const [clickedTitle, setClickedTitle] = useState("");
  const [workouts, setWorkouts] = useState<Training[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(workouts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentTrainings = workouts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  const { userId, loading: userLoading } = useUser();
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  useEffect(() => {
    if (userLoading || !userId) return;

    const fetchWorkouts = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from("workouts")
          .select("*")
          .eq("user_id", userId)
          .order("next_workout");

        if (fetchError) {
          setNotification({
            message: fetchError.message || "Failed to fetch data",
            type: "error",
          });
        }
        if (data) {
          setWorkouts(
            data.map((training: any) => ({
              id: training.id,
              title: training.title,
              nextWorkout: new Date(training.next_workout).toLocaleDateString(),
              duration: training.duration,
            }))
          );
        }
      } catch (err: any) {
        setNotification({
          message: err.message || "Something went wrong",
          type: "error",
        });
      }
    };

    fetchWorkouts();
  }, [userId, userLoading]);

  const handleOpenWorkoutDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
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
      {openDialog && (
        <StartEditWorkoutDialog
          isOpen={true}
          onClose={handleCloseDialog}
          id={clickedId}
          title={clickedTitle}
        />
      )}
      <div className="bg-white shadow-md rounded-xl justify-center items-center p-4 md:p-6 w-full h-full">
        <p className="text-lg md:text-xl font-semibold mb-2">My workouts</p>
        <div className="flex flex-col gap-4">
          {currentTrainings.map((workout) => (
            <WorkoutCard
              key={workout.id}
              name={workout.title}
              duration={workout.duration}
              date={workout.nextWorkout}
              onClick={() => {
                setClickedId(workout.id);
                setClickedTitle(workout.title);
                handleOpenWorkoutDialog();
              }}
            />
          ))}
        </div>
        {workouts.length != ITEMS_PER_PAGE && (
          <div className="flex justify-center items-center mt-6 w-full">
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-full border ${
                    currentPage === i + 1
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MyWorkouts;
