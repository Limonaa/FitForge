import WorkoutsHisotyTable from "../components/WorkoutsHisotyTable";
import { useWorkoutHistory } from "../hooks/useWorkoutHistory";

const HistoryPage = () => {
  const { workouts, loading, error } = useWorkoutHistory();

  return (
    <>
      <div className="flex flex-col items-start justify-center">
        <p className="text-3xl font-bold tracking-wide w-full mb-2">
          Workout history
        </p>
        <p className="text-sm text-gray-500">Track your progress over time</p>
        <WorkoutsHisotyTable workouts={workouts} />
      </div>
    </>
  );
};

export default HistoryPage;
