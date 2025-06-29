import React from "react";
import { Dialog } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import Button from "./Button";

interface StartEditDialogProps {
  id: number;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const StartEditWorkoutDialog: React.FC<StartEditDialogProps> = ({
  id,
  title,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();

  const handleStartWorkout = (id: number) => {
    navigate(`/workouts/session/${id}`);
  };
  const handleEditWorkout = (id: number) => {
    navigate(`/workouts/edit/${id}`);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0">
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
        <Dialog.Panel className="bg-white rounded-xl shadow-lg w-72 max-w-md p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
          <Dialog.Title className="text-2xl font-bold mb-4 text-center tracking-wide flex justify-between ">
            <p className="text-indigo-700">{title}</p>
          </Dialog.Title>
          <div className="grid grid-cols-3">
            <Button variant="green" onClick={() => handleStartWorkout(id)}>
              Start
            </Button>
            <Button
              variant="amber"
              onClick={() => handleEditWorkout(id)}
              className="col-start-3"
            >
              Edit
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default StartEditWorkoutDialog;
