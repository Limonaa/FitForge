import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useMacroHistory } from "../hooks/useMacroHistory";

const options = ["calories", "protein", "carbs", "fats"] as const;
type OptionType = (typeof options)[number];

const COLORS: Record<OptionType, string> = {
  calories: "#f97316",
  protein: "#6366f1",
  carbs: "#06b6d4",
  fats: "#a855f7",
};

const MacroHistoryChart: React.FC = () => {
  const [selected, setSelected] = useState<OptionType>("calories");
  const { data, loading, error } = useMacroHistory(7);

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex flex-col justify-center items-center p-2 bg-white rounded-2xl shadow-lg">
      <h3 className="text-center text-xl font-bold tracking-wide first-letter:capitalize mb-2">
        {selected} history
      </h3>
      <div className="flex justify-center mb-4 gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            className={`px-3 py-1 rounded-full text-sm ${
              selected === opt
                ? "bg-amber-400 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setSelected(opt)}
          >
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={250} className="px-2">
        <LineChart data={data}>
          <XAxis
            dataKey="date"
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
          />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey={selected}
            stroke={COLORS[selected]}
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MacroHistoryChart;
