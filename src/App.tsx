import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ChatPage from "./pages/ChatPage";
import { useAuth } from "./hooks/useAuth";

export default function App() {

  const { isAuthenticated } = useAuth();

  return (

    <Routes>

      <Route path="/" element={<Navigate to="/chat" />} />

      <Route

        path="/chat"
        element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />}
        
      />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route

        path="/profile"
        element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}

      />

    </Routes>

  );

}