import { useState } from "react";
import { supabase } from "../services/supabaseService";
import { X } from "lucide-react";
import NotificationCard from "./NotificationCard";

export function AvatarUploader({
  onClose,
  onUploadSuccess,
}: {
  onClose: () => void;
  onUploadSuccess: (url: string) => void;
}) {
  const MAX_FILE_SIZE_MB = 10;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setNotification({
        message: `File is to big. Max size is ${MAX_FILE_SIZE_MB}MB`,
        type: "error",
      });
    }

    setUploading(true);
    setNotification(null);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setNotification({
        message: userError?.message || "User not authenticated",
        type: "error",
      });
      return;
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}.${fileExt}`;
    const filePath = fileName;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        upsert: true,
      });

    if (error) {
      setNotification({
        message: error?.message || "Storage upload error",
        type: "error",
      });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    const { error: dbError } = await supabase
      .from("user_settings")
      .update({ avatar_url: publicUrl })
      .eq("user_id", user.id);

    if (dbError) {
      setNotification({
        message: dbError?.message || "Failed to save avatar URL",
        type: "error",
      });
    } else {
      onUploadSuccess(publicUrl);
    }

    setUploading(false);
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
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-sm relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
          <h2 className="text-xl font-semibold mb-4">
            Upload your profile photo
          </h2>
          <input type="file" accept="image/*" onChange={handleUpload} />
          {uploading && <p>Uploading...</p>}
        </div>
      </div>
    </>
  );
}
