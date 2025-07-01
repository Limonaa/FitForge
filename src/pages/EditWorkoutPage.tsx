import React from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useWorkoutEdit } from "../hooks/useWorkoutEdit";
import EditableWorkoutHeader from "../components/EditableWorkoutHeader";
import ExerciseEditorTable from "../components/ExerciseEditorTable";
import { ChevronLeft } from "lucide-react";
import Button from "../components/Button";
import PageHeader from "../components/PageHeader";

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
  } = useWorkoutEdit(Number(id));

  if (!workout) return <p>Loading...</p>;

  return (
    <>
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
