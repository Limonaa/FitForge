import { useParams, useNavigate } from "react-router-dom";
import { useWorkoutDetails } from "../hooks/useWorkoutDetails";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseService";
import {
  Dumbbell,
  Repeat,
  GaugeCircle,
  Calendar,
  Timer,
  ChevronLeft,
} from "lucide-react";

const WorkoutHistoryDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const workoutId = id ? parseInt(id) : null;
  const navigate = useNavigate();

  const [workoutInfo, setWorkoutInfo] = useState<{
    name: string;
    date: string;
    time: number;
  } | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(true);

  const {
    exercises,
    loading: loadingExercises,
    error,
  } = useWorkoutDetails(workoutId);

  useEffect(() => {
    if (!workoutId) return;

    const fetchWorkoutInfo = async () => {
      setLoadingInfo(true);
      const { data, error } = await supabase
        .from("workout_history")
        .select("name, date, time")
        .eq("workout_id", workoutId)
        .single();

      if (!error) {
        setWorkoutInfo(data);
      }
      setLoadingInfo(false);
    };

    fetchWorkoutInfo();
  }, [workoutId]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mx-6 mt-4 mb-2">
        <div>
          <p className="text-2xl font-bold">Workout Summary</p>
          <p className="text-gray-500">Detailed breakdown of your session</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-md text-gray-600 hover:text-black transition"
        >
          <ChevronLeft size={18} />
          Back
        </button>
      </div>

      <div className="bg-white shadow-md rounded-xl mx-6 p-6">
        {loadingInfo ? (
          <p className="text-gray-500">Loading workout info...</p>
        ) : workoutInfo ? (
          <>
            <h2 className="text-2xl font-semibold tracking-wide text-indigo-700 mb-2">
              {workoutInfo.name}
            </h2>
            <div className="flex gap-6 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-1">
                <Calendar size={16} />{" "}
                {new Date(workoutInfo.date).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <Timer size={16} /> {workoutInfo.time / 60} min
              </div>
            </div>
          </>
        ) : (
          <p className="text-red-500">Workout not found.</p>
        )}

        <hr className="my-4" />

        <h3 className="text-lg font-semibold mb-4 text-gray-700">Exercises</h3>

        {loadingExercises ? (
          <p className="text-gray-500">Loading exercises...</p>
        ) : error ? (
          <p className="text-red-500">{error.message}</p>
        ) : exercises.length === 0 ? (
          <p className="text-gray-500">No exercises found for this workout.</p>
        ) : (
          exercises
            .sort((a, b) => a.orderInWorkout - b.orderInWorkout)
            .map((exercise) => (
              <div
                key={exercise.id}
                className="border rounded-lg p-4 mb-4 bg-gray-50 hover:bg-gray-100 transition"
              >
                <h4 className="text-lg font-medium text-indigo-600 flex items-center gap-2 mb-2">
                  <Dumbbell size={18} />
                  {exercise.name}
                </h4>
                <div className="grid grid-cols-3 gap-4 text-md text-gray-700">
                  <div className="flex items-center gap-1">
                    <Repeat size={16} className="text-blue-500" />
                    Sets: {exercise.sets}
                  </div>
                  <div className="flex items-center gap-1">
                    <Repeat size={16} className="text-green-500" />
                    Reps: {exercise.reps}
                  </div>
                  <div className="flex items-center gap-1">
                    <GaugeCircle size={16} className="text-pink-500" />
                    Weight: {exercise.weight} kg
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default WorkoutHistoryDetailsPage;
