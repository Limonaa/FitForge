import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

interface MacroPieCHartProps {
  protein: number;
  carbs: number;
  fats: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FF8042"];

const MacroPieChart: React.FC<MacroPieCHartProps> = ({
  protein,
  carbs,
  fats,
}) => {
  const data = [
    { name: "Protein", value: protein },
    { name: "Carbs", value: carbs },
    { name: "Fats", value: fats },
  ];

  return (
    <PieChart width={300} height={300}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
        innerRadius={70}
        paddingAngle={6}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip formatter={(value: number) => `${value}`} />
      <Legend />
    </PieChart>
  );
};

export default MacroPieChart;
