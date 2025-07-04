import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import NotificationCard from "../components/NotificationCard";
import Button from "../components/Button";
import { supabase } from "../services/supabaseService";
import PageHeader from "../components/PageHeader";

const ReportBugPage = () => {
  const { userId, loading: userLoading } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [notification, setNotification] = useState<{
    message: string;
    type: "error" | "success" | "info";
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userLoading) return;

    setIsSubmitting(true);

    const { error } = await supabase.from("bug_reports").insert({
      user_id: userId,
      description: message.slice(0, 2000),
      fixed: false,
    });

    if (error) {
      setNotification({
        message: error?.message || "Failed to send report",
        type: "error",
      });
      setIsSubmitting(false);
      return;
    }

    setNotification({
      message: "Thank you for your attention!",
      type: "info",
    });
    setMessage("");
    setIsSubmitting(false);
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
      <PageHeader
        title="Report bug"
        subtitle="Describe the bug as precisely as you can :)"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="w-full sm:w-1/2">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              maxLength={2000}
              className="w-full min-h-40 border border-gray-700 rounded-xl p-4"
            />
            <p
              className={`w-full text-end text-sm ${
                message.length > 1900 ? "text-red-600" : "text-gray-600"
              }`}
            >
              {message.length}/2000
            </p>
          </div>
          <Button
            variant="primary"
            type="submit"
            disabled={isSubmitting}
            loading={isSubmitting}
            loadingText="Sending..."
          >
            Send
          </Button>
        </form>
      </PageHeader>
    </>
  );
};

export default ReportBugPage;
