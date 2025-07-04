import { useEffect, useState } from "react";
import NotificationCard from "../components/NotificationCard";
import PageHeader from "../components/PageHeader";
import WorkoutsHisotyTable from "../components/WorkoutsHisotyTable";
import { useWorkoutHistory } from "../hooks/useWorkoutHistory";
import LoadWrapper from "../components/LoadWrapper";

const HistoryPage = () => {
  const { workouts, loading, error } = useWorkoutHistory();
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  useEffect(() => {
    if (error) {
      setNotification({
        message: error.message || "Failed to fetch workouts",
        type: "error",
      });
    }
  }, [error]);

  return (
    <>
      <LoadWrapper loading={loading}>
        {notification && (
          <NotificationCard
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
        <PageHeader
          title="Workout history"
          subtitle="Track your progress over time"
        >
          <WorkoutsHisotyTable workouts={workouts} />
        </PageHeader>
      </LoadWrapper>
    </>
  );
};

export default HistoryPage;
