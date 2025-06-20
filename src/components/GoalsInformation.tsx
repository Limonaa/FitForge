import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabaseService";
import { Save } from "lucide-react";

interface GoalsInfoProps {
  caloriesGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatsGoal: number;
  activityLevel: string;
  goalType: string;
}

const GoalsInformation: React.FC<GoalsInfoProps> = ({
  caloriesGoal,
  proteinGoal,
  carbsGoal,
  fatsGoal,
  activityLevel,
  goalType,
}) => {
  const [formData, setFormData] = useState({
    caloriesGoal: 0,
    proteinGoal: 0,
    carbsGoal: 0,
    fatsGoal: 0,
    activityLevel: "moderately",
    goalType: "gain",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setFormData({
      caloriesGoal,
      proteinGoal,
      carbsGoal,
      fatsGoal,
      activityLevel,
      goalType,
    });
  }, [caloriesGoal, proteinGoal, carbsGoal, fatsGoal, activityLevel, goalType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["caloriesGoal", "proteinGoal", "carbsGoal", "fatsGoal"].includes(
        name
      )
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (!user || userError) {
        throw new Error(userError?.message || "Not authenticated");
      }

      const { error: updateError } = await supabase
        .from("user_settings")
        .update({
          calories_goal: formData.caloriesGoal,
          protein_goal: formData.proteinGoal,
          carbs_goal: formData.carbsGoal,
          fats_goal: formData.fatsGoal,
          activity_level: formData.activityLevel,
          goal_type: formData.goalType,
        })
        .eq("user_id", user.id);

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl justify-center items-center m-6 p-2">
      <p className="text-xl font-semibold">Your GOALS</p>
      <form
        onSubmit={handleSubmit}
        className="mt-2 grid grid-cols-2 grid-rows-3 gap-6"
      >
        <div className="flex flex-col">
          <label className="text-gray-700">Calories goal</label>
          <input
            name="caloriesGoal"
            type="number"
            value={formData.caloriesGoal}
            onChange={handleChange}
            className="border border-black rounded-md px-2 py-1 placeholder:text-gray-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700">Protein goal</label>
          <input
            name="proteinGoal"
            type="number"
            value={formData.proteinGoal}
            onChange={handleChange}
            className="border border-black rounded-md px-2 py-1 placeholder:text-gray-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700">Carbs goal</label>
          <input
            name="carbsGoal"
            type="number"
            value={formData.carbsGoal}
            onChange={handleChange}
            className="border border-black rounded-md px-2 py-1 placeholder:text-gray-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700">Fats goal</label>
          <input
            name="fatsGoal"
            type="number"
            value={formData.fatsGoal}
            onChange={handleChange}
            className="border border-black rounded-md px-2 py-1 placeholder:text-gray-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700">Activity level</label>
          <input
            name="activityLevel"
            type="text"
            value={formData.activityLevel}
            onChange={handleChange}
            className="border border-black rounded-md px-2 py-1 placeholder:text-gray-500 placeholder:capitalize"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700">Goal type</label>
          <input
            name="goalType"
            type="text"
            value={formData.goalType}
            onChange={handleChange}
            className="border border-black rounded-md px-2 py-1 placeholder:text-gray-500 placeholder:capitalize"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-700 px-4 py-2 flex flex-row justify-center items-center w-full gap-1 rounded-xl col-start-2"
        >
          <Save width={18} height={18} className="text-white" />
          <p className="text-white text-sm tracking-wide">Save Changes</p>
        </button>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">Saved successfully!</p>}
    </div>
  );
};

export default GoalsInformation;
