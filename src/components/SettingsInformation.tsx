import React, { useState } from "react";
import { supabase } from "../services/supabaseService";
import { LogOut, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

const SettingsInformation = () => {
  const navigate = useNavigate();
  const [newEmail, setNewEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setNotification({
        message: error.message || "Failed to sign out",
        type: "error",
      });
    }
    navigate("/login");
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);
    setEmailMessage(null);
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ email: newEmail });

    if (error) {
      setNotification({
        message: error.message || "Failed to update email",
        type: "error",
      });
    } else {
      setNotification({
        message: "Confirmation link has been sent to your new email",
        type: "info",
      });
      setNewEmail("");
    }

    setLoading(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setNotification({
        message: "New passwords do not match",
        type: "error",
      });
      return;
    }
    if (newPassword.length < 6) {
      setNotification({
        message: "Password must be at least 6 characters",
        type: "error",
      });
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setNotification({
        message: error.message || "Failed to update password",
        type: "error",
      });
    } else {
      setNotification({
        message: "Password updated successfully",
        type: "info",
      });
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
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          loadingText="Changing email..."
          className="mt-2"
        >
          Change email
        </Button>
        {emailMessage && (
          <p className="text-green-600 mt-2 text-sm">{emailMessage}</p>
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

        <Button type="submit" variant="primary">
          Change password
        </Button>
      </form>

      <Button
        type="submit"
        variant="primary"
        loading={loading}
        loadingText="Saving..."
        iconLeft={<LogOut className="w-4 h-4" />}
        onClick={handleSignOut}
        className="w-full"
      >
        Log Out
      </Button>
    </div>
  );
};

export default SettingsInformation;
