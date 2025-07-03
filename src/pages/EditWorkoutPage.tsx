import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useWorkoutEdit } from "../hooks/useWorkoutEdit";
import EditableWorkoutHeader from "../components/EditableWorkoutHeader";
import ExerciseEditorTable from "../components/ExerciseEditorTable";
import { ChevronLeft } from "lucide-react";
import Button from "../components/Button";
import PageHeader from "../components/PageHeader";
import NotificationCard from "../components/NotificationCard";

const EditWorkoutPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    workout,
    exercises,
    updateTitle,
    updateExercise,
    deleteExercise,
    addExercise,
    error: workoutEditError,
  } = useWorkoutEdit(Number(id));
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  useEffect(() => {
    if (workoutEditError) {
      setNotification({
        message: workoutEditError.message || "Failed to fetch workout details",
        type: "error",
      });
    }
  }, [workoutEditError]);

  return (
    <>
      {notification && (
        <NotificationCard
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <PageHeader
        title="Edit workout"
        subtitle="Personalize your exercises"
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
        <div className="w-full mt-6">
          <EditableWorkoutHeader
            title={workout.title}
            onTitleChange={updateTitle}
          />
          <ExerciseEditorTable
            exercises={exercises}
            onUpdate={updateExercise}
            onRemove={deleteExercise}
          />
          <div className="flex justify-end w-full">
            <Button variant="green" onClick={addExercise} className="mt-2">
              Add Exercise
            </Button>
          </div>
        </div>
      </PageHeader>
    </>
  );
};

export default EditWorkoutPage;
