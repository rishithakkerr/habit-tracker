import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";

export default function AddHabit() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api("/habits", "POST", { name, description });
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Add Habit</h2>
      {error && <p className="error">{error}</p>}
      <input placeholder="Habit name (e.g. Read 20 pages)" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
      <button type="submit">Save</button>
    </form>
  );
}
