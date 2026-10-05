import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";

export default function Register({ onAuth }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await api("/auth/register", "POST", { name, email, password });
      onAuth(data.token);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Create account</button>
      <p>Already registered? <Link to="/login">Login</Link></p>
    </form>
  );
}
