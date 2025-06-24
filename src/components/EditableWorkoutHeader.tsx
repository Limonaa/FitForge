import { Edit } from "lucide-react";
import React from "react";

interface EditableWorkoutHeaderProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
}

const EditableWorkoutHeader: React.FC<EditableWorkoutHeaderProps> = ({
  title,
  onTitleChange,
}) => {
  return (
    <div className="flex items-center justify-between mb-4 gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="text-2xl font-bold w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
      />
      <Edit className="w-8 h-8 text-blue-500" />
    </div>
  );
};

export default EditableWorkoutHeader;
