import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api.js";

export default function StreakView() {
  const { id } = useParams();
  const [streak, setStreak] = useState(null);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api(`/habits/${id}/streak`), api(`/habits/${id}/logs`)])
      .then(([s, l]) => {
        setStreak(s);
        setLogs(l);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!streak) return <p>Loading...</p>;

  return (
    <div>
      <Link to="/">← Back</Link>
      <h2>{streak.habitName}</h2>
      <div className="card">
        <div>🔥 Current streak: <b>{streak.currentStreak}</b></div>
        <div>🏆 Longest streak: <b>{streak.longestStreak}</b></div>
        <div>✅ Total check-ins: <b>{streak.totalLogs}</b></div>
        <div>Today: {streak.loggedToday ? "done" : "not done yet"}</div>
      </div>

      <h3>History</h3>
      {logs.length === 0 ? <p>No check-ins yet.</p> : (
        <ul>{logs.map((l) => <li key={l._id}>{l.date}</li>)}</ul>
      )}
    </div>
  );
}
