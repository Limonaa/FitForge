import { useParams, useNavigate } from "react-router-dom";
import { useWorkoutDetails } from "../hooks/useWorkoutDetails";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseService";
import {
  Dumbbell,
  Repeat,
  Calendar,
  Timer,
  ChevronLeft,
  ArrowDownUp,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import WorkoutDetailsCard from "../components/WorkoutDetailsCard";
import NotificationCard from "../components/NotificationCard";
import LoadWrapper from "../components/LoadWrapper";

const WorkoutHistoryDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const workoutId = id ? parseInt(id) : null;
  const navigate = useNavigate();

  const [workoutInfo, setWorkoutInfo] = useState<{
    name: string;
    date: string;
    time: number;
    weight: number;
    reps: number;
    sets: number;
  } | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(true);

  const {
    exercises,
    loading: loadingExercises,
    error: detailsError,
  } = useWorkoutDetails(workoutId);

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  useEffect(() => {
    if (!workoutId) return;

    const fetchWorkoutInfo = async () => {
      setLoadingInfo(true);
      const { data, error } = await supabase
        .from("workout_history")
        .select("name, date, time, weight, reps, sets")
        .eq("workout_id", workoutId)
        .single();

      if (error) {
        setNotification({
          message: error.message || "Failed to fetch workout info",
          type: "error",
        });
      }

      if (!error) {
        setWorkoutInfo(data);
      }
      setLoadingInfo(false);
    };

    fetchWorkoutInfo();
  }, [workoutId]);

  useEffect(() => {
    if (detailsError) {
      setNotification({
        message: detailsError.message || "Failed to fetch workout detais",
        type: "error",
      });
    }
  }, [detailsError]);

  return (
    <>
      <LoadWrapper loading={loadingInfo || loadingExercises}>
        {notification && (
          <NotificationCard
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
        <PageHeader
          title="Workout summary"
          subtitle="Detailed breakdown of your session"
          rightSlot={
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-md text-gray-600 hover:text-black transition"
            >
              <ChevronLeft size={18} />
              Back
            </button>
          }
        >
          {workoutInfo ? (
            <>
              <h2 className="text-3xl font-bold tracking-wide mb-2">
                {workoutInfo.name}
              </h2>
              <div className="flex gap-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-1">
                  <Calendar size={16} />{" "}
                  {new Date(workoutInfo.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Timer size={16} /> {Math.round(workoutInfo.time / 60)} min
                </div>
              </div>
            </>
          ) : (
            <p className="text-red-500">Workout not found.</p>
          )}

          <div className="flex flex-col sm:flex-row gap-6 justify-between items-center mb-8">
            <WorkoutDetailsCard
              type="weight"
              title="Total weight lifted"
              icon={Dumbbell}
              value={workoutInfo?.weight || 0}
              unit={"kg"}
            />
            <WorkoutDetailsCard
              type="reps"
              title="Total reps"
              icon={ArrowDownUp}
              value={workoutInfo?.reps || 0}
            />
            <WorkoutDetailsCard
              type="sets"
              title="Total sets"
              icon={Repeat}
              value={workoutInfo?.sets || 0}
            />
          </div>

          <h3 className="text-xl font-semibold mb-2">Exercises</h3>

          <div className="grid grid-cols-2 sm:grid-cols-4">
            {exercises.length === 0 ? (
              <p className="text-gray-500">
                No exercises found for this workout.
              </p>
            ) : (
              exercises
                .sort((a, b) => a.orderInWorkout - b.orderInWorkout)
                .map((exercise) => (
                  <div key={exercise.id} className="p-4 mb-4">
                    <h4 className="text-xl font-semibold text-indigo-600 mb-2 truncate">
                      {exercise.name}
                    </h4>
                    <div className="text-gray-600 text-md font-semibold border-b-2 w-max">
                      {exercise.weight} kg · {exercise.reps} reps ·{" "}
                      {exercise.sets} sets
                    </div>
                  </div>
                ))
            )}
          </div>
        </PageHeader>
      </LoadWrapper>
    </>
  );
};

export default WorkoutHistoryDetailsPage;
