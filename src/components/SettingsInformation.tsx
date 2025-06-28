import React, { useState } from "react";
import { supabase } from "../services/supabaseService";
import { LogOut, KeyRound, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SettingsInformation = () => {
  const navigate = useNavigate();
  const [newEmail, setNewEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigate("/login");
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setEmailMessage(null);
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ email: newEmail });

    if (error) {
      setEmailError(error.message);
    } else {
      setEmailMessage("Confirmation link has been sent to your new email.");
      setNewEmail("");
    }

    setLoading(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPasswordError(error.message);
    } else {
      setPasswordMessage("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl justify-center items-center m-6 p-4 min-w-80">
      <p className="text-xl font-semibold mb-4">Account settings</p>

      <form onSubmit={handleChangeEmail} className="mb-6 flex flex-col">
        <label className="block mb-2 font-medium">Change Email</label>
        <div className="flex items-center gap-2">
          <Mail width={18} height={18} className="text-gray-600" />
          <input
            type="email"
            placeholder="New email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-700 text-white px-4 py-2 rounded mt-2"
          disabled={loading}
        >
          {loading ? "Sending..." : "Change Email"}
        </button>
        {emailMessage && (
          <p className="text-green-600 mt-2 text-sm">{emailMessage}</p>
        )}
        {emailError && (
          <p className="text-red-600 mt-2 text-sm">{emailError}</p>
        )}
      </form>

      <form onSubmit={handleChangePassword} className="mb-6 flex flex-col">
        <label className="block mb-2 font-medium">Change Password</label>

        <div className="flex items-center gap-2 mb-2">
          <Lock width={18} height={18} className="text-gray-600" />
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Lock width={18} height={18} className="text-gray-600" />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-700 text-white px-4 py-2 rounded"
        >
          Change Password
        </button>

        {passwordMessage && (
          <p className="text-green-600 mt-2 text-sm">{passwordMessage}</p>
        )}
        {passwordError && (
          <p className="text-red-600 mt-2 text-sm">{passwordError}</p>
        )}
      </form>

      <div className="w-full">
        <button
          className="bg-blue-700 px-4 py-2 flex flex-row justify-center items-center gap-2 rounded-xl text-white w-full"
          onClick={handleSignOut}
        >
          <LogOut width={18} height={18} />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default SettingsInformation;
