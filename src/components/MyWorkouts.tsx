import React, { useEffect, useState } from "react";
import WorkoutCard from "./WorkoutCard";
import { supabase } from "../services/supabaseService";

const ITEMS_PER_PAGE = 3;

interface Training {
  id: number;
  title: string;
  nextWorkout: string;
  duration: number;
}

const MyWorkouts = () => {
  const [workouts, setWorkouts] = useState<Training[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(workouts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentTrainings = workouts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user)
          throw new Error(userError?.message || "User not authenticated");

        const { data, error: fetchError } = await supabase
          .from("workouts")
          .select("*")
          .eq("user_id", user.id)
          .order("next_workout");

        if (fetchError) throw fetchError;
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
        console.error(err);
      }
    };

    fetchWorkouts();
  }, []);

  const handleAddWorkout = () => {
    // TODO: display dialog to start or edit workout.
  };

  return (
    <div className="bg-white shadow-md rounded-xl justify-center items-center p-6 w-full h-full">
      <p className="text-xl font-semibold mb-2">My workouts</p>
      <div className="flex flex-col gap-4">
        {currentTrainings.map((workout) => (
          <WorkoutCard
            key={workout.id}
            name={workout.title}
            duration={workout.duration}
            date={workout.nextWorkout}
            onClick={() => {}}
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
                    ? "bg-blue-500 text-white"
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
  );
};

export default MyWorkouts;
