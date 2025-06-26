import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { supabase } from "../services/supabaseService";
import { useUser } from "../context/UserContext";

interface ProfileInforamtionsProps {
  name: string;
  email: string;
  gender: string;
  birthdate: string;
}

const ProfileInformations: React.FC<ProfileInforamtionsProps> = ({
  name,
  email,
  gender,
  birthdate,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    birthdate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { userId, loading: userLoading } = useUser();

  useEffect(() => {
    setFormData({
      name,
      gender,
      birthdate,
    });
  }, [name, gender, birthdate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (userLoading || !userId) return;

    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: settingsError } = await supabase
        .from("user_settings")
        .update({
          gender: formData.gender,
          name: formData.name,
          birthdate: formData.birthdate,
        })
        .eq("user_id", userId);
      if (settingsError) throw settingsError;

      setSuccess(true);
    } catch (err: any) {
      setError(err.message ?? String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl justify-center items-center m-6 p-2">
      <p className="text-xl font-semibold">Profile informations</p>
      <form
        onSubmit={handleSubmit}
        className="mt-2 grid grid-cols-2 grid-rows-2 gap-6"
      >
        <div className="flex flex-col">
          <label className="text-gray-700">Name</label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="border border-black rounded-md px-2 py-1 placeholder:text-gray-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700">Email Address</label>
          <input
            type="email"
            disabled
            placeholder={email}
            className="border border-black rounded-md px-2 py-1 placeholder:text-gray-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700">Gender</label>
          <select
            className="border border-black rounded-md px-2 py-1"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700">Birthdate</label>
          <input
            name="birthdate"
            type="date"
            value={formData.birthdate}
            onChange={handleChange}
            className="border border-black rounded-md px-2 py-1"
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

export default ProfileInformations;
