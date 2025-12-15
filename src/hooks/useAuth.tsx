import { createContext, useContext, useState, type ReactNode } from "react";

type AuthContextType = {
  token: string | null;
  userId: number | null;
  name?: string;
  profilePicture?: string;
  login: (token: string, userId: number, name?: string, profilePicture?: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [userId, setUserId] = useState<number | null>(
    localStorage.getItem("userId") ? Number(localStorage.getItem("userId")) : null
  );
  const [name, setName] = useState<string | undefined>(localStorage.getItem("name") || undefined);
  const [profilePicture, setProfilePicture] = useState<string | undefined>(
    localStorage.getItem("profilePicture") || undefined
  );

  const login = (jwt: string, id: number, userName?: string, userProfile?: string) => {
    localStorage.setItem("token", jwt);
    localStorage.setItem("userId", id.toString());
    if (userName) localStorage.setItem("name", userName);
    if (userProfile) localStorage.setItem("profilePicture", userProfile);

    setToken(jwt);
    setUserId(id);
    setName(userName);
    setProfilePicture(userProfile);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    localStorage.removeItem("profilePicture");

    setToken(null);
    setUserId(null);
    setName(undefined);
    setProfilePicture(undefined);
  };

  return (
    <AuthContext.Provider value={{ token, userId, name, profilePicture, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
