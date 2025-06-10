import React, { useState } from "react";
import { supabase } from "../services/supabaseService";
import { User, Weight, TrendingUp, Settings, Save } from "lucide-react";
import { useUserSettings } from "../hooks/useUserSettings";

const AccountPage = () => {
  const {
    weight,
    height,
    gender,
    caloriesGoal,
    proteinGoal,
    carbsGoal,
    fatsGoal,
    name,
  } = useUserSettings();
  const [selected, setSelected] = useState<"prof" | "meas" | "goals" | "sett">(
    "prof"
  );

  const handleProfileSubmit = () => {};

  return (
    <>
      <p className="text-2xl font-bold mx-6">Account</p>
      <p className="text-gray-500 mx-6">Manage your profile and preferences</p>
      <div className="flex flex-row w-full">
        <div className="bg-white shadow-md rounded-xl flex flex-col justify-center items-center w-1/4 m-6">
          <div className="bg-blue-200 rounded-full w-24 h-24 flex justify-center items-center m-4">
            <User width={40} height={40} className="text-blue-400" />
          </div>
          <p className="text-xl font-semibold">{name}</p>
          <div className="my-2 w-3/4">
            <div className="flex flex-row items-center justify-start bg-blue-100 bg-opacity-75 rounded-xl px-4 py-3 gap-5 mt-1">
              <User width={18} height={18} className="text-purple-500" />
              <p className="text-purple-500">Profile</p>
            </div>
            <div className="flex flex-row items-center justify-start bg-white rounded-xl px-4 py-3 gap-5 mt-1">
              <Weight width={18} height={18} className="text-gray-600" />
              <p className="text-gray-600">Measurements</p>
            </div>
            <div className="flex flex-row items-center justify-start bg-white rounded-xl px-4 py-3 gap-5 mt-1">
              <TrendingUp width={18} height={18} className="text-gray-600" />
              <p className="text-gray-600">Goals</p>
            </div>
            <div className="flex flex-row items-center justify-start bg-white rounded-xl px-4 py-3 gap-5 mt-1">
              <Settings width={18} height={18} className="text-gray-600" />
              <p className="text-gray-600">Settings</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-xl justify-center items-center w-1/4 m-6 p-2">
          <p className="text-xl font-semibold">Profile informations</p>
          <form onSubmit={handleProfileSubmit} className="mt-2">
            <div className="flex flex-col">
              <div className="flex flex-row">
                <div>
                  <label>Name</label>
                  <input type="text" />
                </div>
                <div>
                  <label>Email Address</label>
                  <input type="email" />
                </div>
              </div>
              <div className="flex flex-row">
                <div>
                  <label>Gender</label>
                  <select>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
                <div>
                  <label>Birthdate</label>
                  <input type="date" />
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  className="bg-purple-600 px-4 py-2 flex flex-row justify-center items-center w-1/2 gap-1 rounded-xl"
                >
                  <Save width={18} height={18} className="text-white" />
                  <p className="text-white text-sm">Save Changes</p>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AccountPage;
