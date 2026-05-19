import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

const CATEGORIES = ["All", "Water Supply", "Electricity", "Roads", "Sanitation", "Public Safety", "Healthcare", "Education", "Other"];

const statusBadge = (status) => {
  const map = { Pending: "badge-pending", "In Progress": "badge-progress", Resolved: "badge-resolved", Rejected: "badge-rejected" };
  return <span className={`badge ${map[status] || "badge-pending"}`}>{status}</span>;
};

const ComplaintList = () => {
  const [complaints, setComplaints] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const params = category !== "All" ? `?category=${category}` : "";
      const { data } = await API.get(`/api/complaints${params}`);
      setComplaints(data.complaints);
      setFiltered(data.complaints);
    } catch (err) {
      setError("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaints(); }, [category]);

  const handleSearch = async () => {
    if (!search.trim()) return fetchComplaints();
    try {
      const { data } = await API.get(`/api/complaints/search?location=${search}`);
      setFiltered(data.complaints);
    } catch {
      setError("Search failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this complaint?")) return;
    try {
      await API.delete(`/api/complaints/${id}`);
      setFiltered((prev) => prev.filter((c) => c._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="container" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ marginBottom: 0 }}>📋 All Complaints</h1>
        <Link to="/complaints/new" className="btn btn-primary">➕ New Complaint</Link>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: "1.2rem" }}>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div>
            <label style={{ display: "block", fontWeight: 500, marginBottom: "0.3rem", fontSize: "0.9rem" }}>Filter by Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: "0.6rem 1rem", borderRadius: "8px", border: "1.5px solid #d1d5db", fontSize: "0.95rem" }}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontWeight: 500, marginBottom: "0.3rem", fontSize: "0.9rem" }}>Search by Location</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                placeholder="e.g. Ghaziabad"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                style={{ flex: 1, padding: "0.6rem 1rem", borderRadius: "8px", border: "1.5px solid #d1d5db", fontSize: "0.95rem" }}
              />
              <button className="btn btn-primary" onClick={handleSearch}>Search</button>
              {search && <button className="btn btn-secondary" onClick={() => { setSearch(""); fetchComplaints(); }}>Clear</button>}
            </div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>Loading complaints...</div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
          <p style={{ fontSize: "2rem" }}>📭</p>
          <p>No complaints found.</p>
        </div>
      ) : (
        <div>
          <p style={{ color: "#6b7280", marginBottom: "1rem", fontSize: "0.9rem" }}>{filtered.length} complaint(s) found</p>
          {filtered.map((c) => (
            <div key={c._id} className="card" style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "0.4rem" }}>
                    <h3>{c.title}</h3>
                    {statusBadge(c.status)}
                    {c.aiAnalysis?.priority && (
                      <span className={`badge badge-${c.aiAnalysis.priority.toLowerCase()}`}>
                        {c.aiAnalysis.priority} Priority
                      </span>
                    )}
                  </div>
                  <p style={{ color: "#6b7280", fontSize: "0.85rem", marginBottom: "0.4rem" }}>
                    👤 {c.name} • 📧 {c.email} • 📍 {c.location} • 🏷️ {c.category}
                  </p>
                  <p style={{ color: "#374151", fontSize: "0.9rem" }}>{c.description.substring(0, 150)}{c.description.length > 150 ? "..." : ""}</p>
                  {c.aiAnalysis?.department && (
                    <p style={{ marginTop: "0.4rem", fontSize: "0.85rem", color: "#4f46e5" }}>🤖 Dept: {c.aiAnalysis.department}</p>
                  )}
                  <p style={{ marginTop: "0.4rem", fontSize: "0.8rem", color: "#9ca3af" }}>
                    Submitted: {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexDirection: "column" }}>
                  <button className="btn btn-outline" style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem" }} onClick={() => navigate(`/complaints/status/${c._id}`)}>
                    ✏️ Update
                  </button>
                  <Link to={`/ai-analysis?id=${c._id}`} className="btn btn-success" style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem", textAlign: "center" }}>
                    🤖 AI Analyze
                  </Link>
                  <button className="btn btn-danger" style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem" }} onClick={() => handleDelete(c._id)}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComplaintList;
