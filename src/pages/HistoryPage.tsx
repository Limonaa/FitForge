import PageHeader from "../components/PageHeader";
import WorkoutsHisotyTable from "../components/WorkoutsHisotyTable";
import { useWorkoutHistory } from "../hooks/useWorkoutHistory";

const HistoryPage = () => {
  const { workouts, loading, error } = useWorkoutHistory();

  return (
    <>
      <PageHeader
        title="Workout history"
        subtitle="Track your progress over time"
      >
        <WorkoutsHisotyTable workouts={workouts} />
      </PageHeader>
    </>
  );
};

export default HistoryPage;
