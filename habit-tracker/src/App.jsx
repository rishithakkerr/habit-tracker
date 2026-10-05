import { useState } from "react";
import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AddHabit from "./pages/AddHabit.jsx";
import StreakView from "./pages/StreakView.jsx";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  const onAuth = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    navigate("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };
  
  const protect = (page) => (token ? page : <Navigate to="/login" />);

  return (
    <div className="container">
      <nav>
        <b>Habit Tracker</b>
        {token ? (
          <span>
            <Link to="/">Dashboard</Link>
            <Link to="/add">Add Habit</Link>
            <button onClick={logout}>Logout</button>
          </span>
        ) : (
          <span>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </span>
        )}
      </nav>

      <Routes>
        <Route path="/login" element={<Login onAuth={onAuth} />} />
        <Route path="/register" element={<Register onAuth={onAuth} />} />
        <Route path="/" element={protect(<Dashboard />)} />
        <Route path="/add" element={protect(<AddHabit />)} />
        <Route path="/habits/:id" element={protect(<StreakView />)} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}
