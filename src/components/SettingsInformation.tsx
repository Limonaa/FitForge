import React from "react";
import { supabase } from "../services/supabaseService";
import { LogOut, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SettingsInformation = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigate("/login");
  };

  const handleChangePassword = async () => {
    // TODO
  };

  return (
    <div className="bg-white shadow-md rounded-xl justify-center items-center m-6 p-2">
      <p className="text-xl font-semibold">Account settings</p>
      <div className="mt-2 grid grid-cols-2 grid-rows-2 gap-6">
        <button
          className="bg-blue-700 px-4 py-2 flex flex-row justify-center items-center w-full gap-1 rounded-xl"
          onClick={handleSignOut}
        >
          <LogOut width={18} height={18} className="text-white" />
          <p className="text-white text-sm tracking-wide">Log Out</p>
        </button>
        <button
          className="bg-blue-700 px-4 py-2 flex flex-row justify-center items-center w-full gap-1 rounded-xl"
          onClick={handleChangePassword}
        >
          <KeyRound width={18} height={18} className="text-white" />
          <p className="text-white text-sm tracking-wide">Change Password</p>
        </button>
      </div>
    </div>
  );
};

export default SettingsInformation;
