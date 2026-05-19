import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <span style={styles.logo}>🏛️</span>
        <Link to="/" style={styles.brandText}>SmartComplaint</Link>
      </div>

      {user && (
        <div style={styles.links}>
          <Link to="/complaints" style={{ ...styles.link, ...(isActive("/complaints") ? styles.activeLink : {}) }}>
            📋 All Complaints
          </Link>
          <Link to="/complaints/new" style={{ ...styles.link, ...(isActive("/complaints/new") ? styles.activeLink : {}) }}>
            ➕ New Complaint
          </Link>
          <Link to="/ai-analysis" style={{ ...styles.link, ...(isActive("/ai-analysis") ? styles.activeLink : {}) }}>
            🤖 AI Analysis
          </Link>
          <span style={styles.userBadge}>👤 {user.name}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    background: "#4f46e5",
    padding: "0.9rem 2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 2px 8px rgba(79,70,229,0.3)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  brand: { display: "flex", alignItems: "center", gap: "0.5rem" },
  logo: { fontSize: "1.5rem" },
  brandText: {
    color: "white",
    textDecoration: "none",
    fontSize: "1.2rem",
    fontWeight: "700",
    letterSpacing: "-0.5px",
  },
  links: { display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" },
  link: {
    color: "rgba(255,255,255,0.85)",
    textDecoration: "none",
    padding: "0.4rem 0.8rem",
    borderRadius: "6px",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "all 0.2s",
  },
  activeLink: {
    background: "rgba(255,255,255,0.2)",
    color: "white",
  },
  userBadge: {
    color: "rgba(255,255,255,0.7)",
    fontSize: "0.85rem",
    marginLeft: "0.5rem",
  },
  logoutBtn: {
    background: "rgba(255,255,255,0.15)",
    color: "white",
    border: "1px solid rgba(255,255,255,0.3)",
    padding: "0.4rem 0.9rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "all 0.2s",
  },
};

export default Navbar;
