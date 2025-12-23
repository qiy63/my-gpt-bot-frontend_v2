import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProfilePage from "./pages/Profile";
import ChatPage from "./pages/ChatPage";
import FeedbackPage from "./pages/Feedback";
import { useAuth } from "./hooks/useAuth";

const App: React.FC = () => {
  const { token } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!token ? <Login /> : <Navigate to="/chat" />} />
      <Route path="/register" element={!token ? <Register /> : <Navigate to="/chat" />} />
      <Route path="/profile" element={token ? <ProfilePage /> : <Navigate to="/login" />} />
      <Route path="/feedback" element={token ? <FeedbackPage /> : <Navigate to="/login" />} />
      <Route path="/chat" element={token ? <ChatPage /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to={token ? "/chat" : "/login"} />} />
    </Routes>
  );
};

export default App;
