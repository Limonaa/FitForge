import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { supabase } from "../services/supabaseService";
import { useUser } from "../context/UserContext";
import Button from "./Button";
import NotificationCard from "./NotificationCard";

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
  const [success, setSuccess] = useState(false);
  const { userId, loading: userLoading } = useUser();
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

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
    if (userLoading || !userId) return;

    e.preventDefault();
    setLoading(true);
    setNotification(null);
    setSuccess(false);

    try {
      const { error: updateError } = await supabase
        .from("user_settings")
        .update({
          weight: formData.weight,
          height: formData.height,
        })
        .eq("user_id", userId);

      if (updateError) {
        setNotification({
          message: updateError.message || "Failed to update data",
          type: "error",
        });
      }
      setSuccess(true);
    } catch (err: any) {
      setNotification({
        message: err.message || "Something went wrong",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {notification && (
        <NotificationCard
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
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
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            loadingText="Saving..."
            iconLeft={<Save className="w-4 h-4" />}
            className="sm:col-start-2 col-span-2 sm:col-span-1"
          >
            Save changes
          </Button>
        </form>

        {success && <p className="text-green-500 mt-2">Saved successfully!</p>}
      </div>
    </>
  );
};

export default MeasurementsInfo;
