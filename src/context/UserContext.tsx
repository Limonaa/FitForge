import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabaseService";

type UserContextType = {
  userId: string | null;
  loading: boolean;
};

const UserContext = createContext<UserContextType>({
  userId: null,
  loading: true,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUserId(user?.id || null);
      setLoading(false);
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ userId, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
