import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { supabase } from "../services/supabaseService";

interface MeasInfoProps {
  height: number;
  weight: number;
}

const MeasurementsInfo: React.FC<MeasInfoProps> = ({ height, weight }) => {
  const [formData, setFormData] = useState({
    height: 0,
    weight: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setFormData({ height, weight });
  }, [height, weight]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
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
          weight: formData.weight,
          height: formData.height,
        })
        .eq("user_id", user.id);

      if (updateError) {
        throw updateError;
      }
      setSuccess(true);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl justify-center items-center m-6 p-2">
      <p className="text-xl font-semibold">Your measurements</p>
      <form
        onSubmit={handleSubmit}
        className="mt-2 grid grid-cols-2 grid-rows-1 gap-6"
      >
        <div className="flex flex-col">
          <label className="text-gray-700 flex justify-between">
            Height <p className="text-gray-500">(cm)</p>
          </label>
          <input
            name="height"
            type="number"
            value={formData.height}
            onChange={handleChange}
            className="border border-black rounded-md px-2 py-1 placeholder:text-gray-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 flex justify-between">
            Weight <p className="text-gray-500">(kg)</p>
          </label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            className="border border-black rounded-md px-2 py-1 placeholder:text-gray-500"
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

export default MeasurementsInfo;
