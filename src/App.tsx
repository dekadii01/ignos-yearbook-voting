import { JSX, useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabase";

import { Login } from "./components/Login";
import { Landing } from "./components/Landing";
import { CategorySelection } from "./components/CategorySelection";
import { VotingPage } from "./components/VotingPage";
import { SuccessPage } from "./components/SuccessPage";
import { AlreadyVoted } from "./components/AlreadyVoted";
import { AdminDashboard } from "./components/AdminDashboard";
import { SummaryPage } from "./components/SummaryPage";

/* ================= TYPES ================= */

type LoginResult = {
  id: string;
  username: string;
  name: string;
  role: "admin" | "student";
};

export type User = {
  id: string;
  type: "student" | "admin";
  name: string;
} | null;

/* ================= APP ================= */

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>(null);
  const [votes, setVotes] = useState<Record<string, string>>({});

  /* ================= RESTORE LOGIN ================= */
  useEffect(() => {
    const stored = localStorage.getItem("yearbook-user");

    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  /* ================= LOGIN ================= */
  const handleLogin = async (username: string, password: string) => {
    const { data, error } = await supabase
      .rpc("login_user", {
        input_username: username.trim(),
        input_password: password.trim(),
      })
      .single<LoginResult>();

    if (error || !data) {
      throw new Error("Login gagal");
    }

    const newUser: User = {
      id: data.id,
      type: data.role,
      name: data.name,
    };

    setUser(newUser);
    localStorage.setItem("yearbook-user", JSON.stringify(newUser));

    navigate(data.role === "admin" ? "/admin" : "/");
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("yearbook-user");
    navigate("/login");
  };

  /* ================= PROTECTED ROUTE ================= */
  const RequireAuth = ({ children }: { children: JSX.Element }) => {
    if (!user) return <Navigate to="/login" replace />;
    return children;
  };

  const RequireAdmin = ({ children }: { children: JSX.Element }) => {
    if (!user || user.type !== "admin") {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const RequireGuest = ({ children }: { children: JSX.Element }) => {
    if (user) return <Navigate to="/" replace />;
    return children;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Routes>
        <Route
          path="/login"
          element={
            <RequireGuest>
              <Login onLogin={handleLogin} />
            </RequireGuest>
          }
        />

        <Route
          path="/"
          element={
            <RequireAuth>
              {user?.type === "admin" ? (
                <Navigate to="/admin" replace />
              ) : (
                <Landing onLogout={handleLogout} />
              )}
            </RequireAuth>
          }
        />

        <Route
          path="/categories"
          element={
            <RequireAuth>
              <CategorySelection />
            </RequireAuth>
          }
        />

        <Route
          path="/vote/:categoryId"
          element={
            <RequireAuth>
              <VotingPage />
            </RequireAuth>
          }
        />

        <Route
          path="/success/:categoryId"
          element={
            <RequireAuth>
              <SuccessPage />
            </RequireAuth>
          }
        />

        <Route
          path="/already-voted/:categoryId"
          element={
            <RequireAuth>
              <AlreadyVoted />
            </RequireAuth>
          }
        />

        <Route
          path="/summary"
          element={
            <RequireAuth>
              <SummaryPage />
            </RequireAuth>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminDashboard onLogout={handleLogout} />
            </RequireAdmin>
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
