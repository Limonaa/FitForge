import React, { useMemo, useState } from "react";
import type { Workout } from "../types/Workout";
import { useNavigate } from "react-router-dom";

interface WorkoutsHistoryTableProps {
  workouts: Workout[];
}

const WorkoutsHistoryTable: React.FC<WorkoutsHistoryTableProps> = ({
  workouts,
}) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");

  const filteredWorkouts = useMemo(() => {
    return workouts.filter((w) =>
      w.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [workouts, filter]);

  const handleWorkoutDetails = (id: number) => {
    navigate(`/history/${id}`);
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-4 sm:p-6 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <p className="text-lg font-semibold">Recent Workouts</p>
        <input
          type="text"
          placeholder="Filter by name..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {filteredWorkouts.length === 0 ? (
        <p className="text-sm text-gray-500 mt-4">No workouts found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[600px] w-full text-sm text-left text-gray-900">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Workout
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Date
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Duration
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Reps/Sets
                </th>
                <th className="px-4 py-3 font-medium text-end whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkouts.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => {
                    if (window.innerWidth < 640) {
                      handleWorkoutDetails(item.id);
                    }
                  }}
                  className="border-b last:border-none transition-colors 
             sm:cursor-default sm:hover:bg-transparent 
             hover:bg-gray-100 cursor-pointer"
                >
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{item.time} min</td>
                  <td className="px-4 py-3">
                    {item.reps}/{item.sets}
                  </td>
                  <td className="px-4 py-3 text-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWorkoutDetails(item.id);
                      }}
                      className="text-indigo-600 hover:text-indigo-700 font-medium transition"
                    >
                      Details →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WorkoutsHistoryTable;
