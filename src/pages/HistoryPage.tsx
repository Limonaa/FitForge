import HistoryItem from "../components/HistoryItem";
import { useWorkoutHistory } from "../hooks/useWorkoutHistory";

const HistoryPage = () => {
  const { workouts, loading, error } = useWorkoutHistory();

  return (
    <>
      <p className="text-2xl font-bold mx-6">Workout History</p>
      <p className="text-gray-500 mx-6">Track your progress over time</p>
      <div className="w-full grid grid-cols-5 grid-rows-1 border-gray-400 border-b-2 mb-2">
        <p className="text-lg text-gray-700">Workout</p>
        <p className="text-lg text-gray-700">Date</p>
        <p className="text-lg text-gray-700">Duration</p>
        <p className="text-lg text-gray-700">Reps | Sets</p>
      </div>
      {loading && (
        <p className="text-center font-semibold text-xl">Loading Workouts...</p>
      )}
      {workouts.map((workout) => (
        <HistoryItem
          key={workout.id}
          name={workout.name}
          date={workout.date}
          duration={workout.time}
          reps={workout.reps}
          sets={workout.sets}
          onClick={() => {}}
          //   TODO: Show workout details
        />
      ))}
    </>
  );
};

export default HistoryPage;
