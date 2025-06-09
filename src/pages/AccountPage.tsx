import React, { useState } from "react";
import { supabase } from "../services/supabaseService";

const AccountPage = () => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("Male");
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);

  const handleSubmit = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) return;

    const { error } = await supabase
      .from("user_settings")
      .update({
        weight: weight,
        height: height,
      })
      .eq("user_id", user.id)
      .single();
    if (error) console.log(error);
  };

  return (
    <form className="p-4 w-1/2" onSubmit={handleSubmit}>
      <p className="text-3xl font-bold">Account</p>
      <p className="text-xl font-semibold">Personal information</p>
      <div className="flex flex-col w-full mt-2">
        <label className="block text-sm font-medium text-gray-700">
          First name
        </label>
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-xl"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="flex flex-row gap-4 w-full mt-4">
          <div className="flex flex-col w-full">
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-xl"
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="flex flex-col w-full">
            <label className="block text-sm font-medium text-gray-700">
              Height (cm)
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-xl"
              placeholder="Height"
              type="number"
              value={height}
              max={250}
              onChange={(e) => setHeight(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="flex flex-row gap-4 w-full mt-4">
          <div className="flex flex-col w-full">
            <label className="block text-sm font-medium text-gray-700">
              Weight (kg)
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-xl"
              placeholder="Weight"
              value={weight}
              type="number"
              max={500}
              onChange={(e) => setWeight(Number(e.target.value))}
            />
          </div>
        </div>
      </div>
      <button type="submit">Save</button>
    </form>
  );
};

export default AccountPage;
