import React from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis, Legend } from "recharts";

interface CalorieProgressChartProps {
  calories: number;
  goal: number;
}

const CalorieProgressChart: React.FC<CalorieProgressChartProps> = ({
  calories,
  goal,
}) => {
  const rawPercentage = (calories / goal) * 100;
  const percentage = Math.min(rawPercentage, 100);
  const overLimit = calories >= goal * 1.1;

  const data = [
    {
      name: "Postęp",
      value: percentage,
      fill: overLimit
        ? "#ef4444"
        : rawPercentage < 50
        ? "#fa7171"
        : rawPercentage < 90
        ? "#ffbf00"
        : "#4ade80",
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center p-2 bg-white rounded-2xl shadow-lg">
      <p className="text-center text-xl font-bold -mb-4 tracking-wide">
        Daily calories
      </p>
      <RadialBarChart
        width={220}
        height={300}
        cx={110}
        cy={150}
        innerRadius={80}
        outerRadius={120}
        barSize={18}
        data={data}
        startAngle={180}
        endAngle={0}
        className="mb-4"
      >
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
        <RadialBar background dataKey="value" />
        <Legend
          iconSize={10}
          layout="horizontal"
          verticalAlign="bottom"
          height={36}
          align="center"
          payload={[
            {
              value: `${calories} / ${goal} kcal`,
              type: "circle",
              color: data[0].fill,
              id: "progress",
            },
          ]}
        />
      </RadialBarChart>
    </div>
  );
};

export default CalorieProgressChart;
