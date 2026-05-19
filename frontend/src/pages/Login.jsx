import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/complaints");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div className="card" style={styles.card}>
        <div style={styles.header}>
          <span style={styles.icon}>🏛️</span>
          <h1 style={{ marginBottom: "0.3rem", fontSize: "1.6rem" }}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to your account</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
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
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem" }} disabled={loading}>
            {loading ? <><span className="spinner"></span> Signing in...</> : "Sign In"}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#4f46e5", fontWeight: 600 }}>
            Register here
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

export default Login;
