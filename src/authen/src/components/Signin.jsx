import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient"; // adjust the path as needed

function Signin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // Supabase sign-in
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    if (error) {
      setError("Invalid email or password");
    } else {
      navigate("/");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 300, margin: "0 auto" }}>
      <h2>Sign In</h2>
      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
      <div style={{ marginBottom: 12 }}>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 8, marginTop: 4 }}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 8, marginTop: 4 }}
        />
      </div>
      <button type="submit" style={{ width: "100%", padding: 8 }}>
        Sign In
      </button>
    </form>
  );
}

export default Signin;