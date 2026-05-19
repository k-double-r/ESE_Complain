import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/complaints");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div className="card" style={styles.card}>
        <div style={styles.header}>
          <span style={styles.icon}>📝</span>
          <h1 style={{ marginBottom: "0.3rem", fontSize: "1.6rem" }}>Create Account</h1>
          <p style={styles.subtitle}>Register to file complaints</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Rahul Kumar"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="rahul@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem" }} disabled={loading}>
            {loading ? <><span className="spinner"></span> Creating account...</> : "Register"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#4f46e5", fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    padding: "1rem",
  },
  card: { width: "100%", maxWidth: "420px", padding: "2.5rem" },
  header: { textAlign: "center", marginBottom: "2rem" },
  icon: { fontSize: "3rem" },
  subtitle: { color: "#6b7280", fontSize: "0.95rem", marginTop: "0.3rem" },
  footer: { textAlign: "center", marginTop: "1.5rem", color: "#6b7280", fontSize: "0.9rem" },
};

export default Register;
