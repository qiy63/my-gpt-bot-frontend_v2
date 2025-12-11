import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {

    token: string | null;
    userId: number | null;
    isAuthenticated: boolean;

    login: (token: string, userId: number) => void;
    logout: () => void;

}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

    const [userId, setUserId] = useState<number | null>(

        Number(localStorage.getItem("userId"))

    );

    const login = (t: string, id: number) => {

        setToken(t);
        setUserId(id);

        localStorage.setItem("token", t);
        localStorage.setItem("userId", String(id));

    };

    const logout = () => {

        setToken(null);
        setUserId(null);

        localStorage.removeItem("token");
        localStorage.removeItem("userId");

    };

    return (

        <AuthContext.Provider value={{ token, userId, isAuthenticated: !!token, login, logout }}>

            {children}

        </AuthContext.Provider>

    );

};

export const useAuthContext = () => {

    const ctx = useContext(AuthContext);

    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");

    return ctx;

};