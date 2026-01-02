import React, { type JSX } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProfilePage from "./pages/Profile";
import ChatPage from "./pages/ChatPage";
import FeedbackPage from "./pages/Feedback";
import DocumentPage from "./pages/Document";
import AdminPage from "./pages/Admin";
import AdminLegalInfoPage from "./pages/AdminLegalInfo";
import { useAuth } from "./hooks/useAuth";

const App: React.FC = () => {
  const { token, role } = useAuth();

  const AdminRoute = ({ children }: { children: JSX.Element }) =>
    token && role === "admin" ? children : <Navigate to={token ? "/chat" : "/login"} replace />;

  return (
    <Routes>
      <Route path="/login" element={!token ? <Login /> : <Navigate to="/chat" />} />
      <Route path="/register" element={!token ? <Register /> : <Navigate to="/chat" />} />
      <Route path="/profile" element={token ? <ProfilePage /> : <Navigate to="/login" />} />
      <Route path="/feedback" element={token ? <FeedbackPage /> : <Navigate to="/login" />} />
      <Route path="/chat" element={token ? <ChatPage /> : <Navigate to="/login" />} />
      <Route path="/legal-info" element={token ? <DocumentPage /> : <Navigate to="/login" />} />
      <Route
        path="/admin/legal-info"
        element={
          <AdminRoute>
            <AdminLegalInfoPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        }
      />
      <Route path="*" element={<Navigate to={token ? "/chat" : "/login"} />} />
    </Routes>
  );
};

export default App;
