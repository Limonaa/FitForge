import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseService";
import { Navigate } from "react-router-dom";

function Wrapper({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSesstion = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setAuthenticated(!!session);
      setLoading(false);
    };
    getSesstion();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  } else if (authenticated) {
    return <>{children}</>;
  }
  return <Navigate to="/login" />;
}

export default Wrapper;
