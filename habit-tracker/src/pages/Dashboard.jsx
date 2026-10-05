import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";

export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [error, setError] = useState("");

  const load = () =>
    api("/habits")
      .then(setHabits)
      .catch((err) => setError(err.message));

  useEffect(() => {
    load();
  }, []);

  const checkIn = async (id) => {
    setError("");
    try {
      await api(`/habits/${id}/log`, "POST", {});
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this habit and all its logs?")) return;
    try {
      await api(`/habits/${id}`, "DELETE");
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>My Habits</h2>
      {error && <p className="error">{error}</p>}
      {habits.length === 0 && <p>No habits yet. <Link to="/add">Add one</Link>.</p>}

      {habits.map((h) => (
        <div className="card" key={h._id}>
          <div>
            <b>{h.name}</b>
            {h.description && <div className="muted">{h.description}</div>}
            <div>🔥 Current streak: {h.currentStreak} day(s)</div>
          </div>
          <div className="actions">
            <button disabled={h.loggedToday} onClick={() => checkIn(h._id)}>
              {h.loggedToday ? "Done today ✓" : "Check in"}
            </button>
            <Link to={`/habits/${h._id}`}>Streak</Link>
            <button className="danger" onClick={() => remove(h._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
