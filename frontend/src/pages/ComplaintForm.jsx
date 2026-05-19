import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const CATEGORIES = [
  "Water Supply",
  "Electricity",
  "Roads",
  "Sanitation",
  "Public Safety",
  "Healthcare",
  "Education",
  "Other",
];

const ComplaintForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    title: "",
    description: "",
    category: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const { data } = await API.post("/api/complaints", form);
      setSuccess("✅ Complaint submitted successfully! Complaint ID: " + data.complaint._id);
      setForm({ name: "", email: "", title: "", description: "", category: "", location: "" });
      // Redirect after 2 seconds
      setTimeout(() => navigate("/complaints"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
      <h1>📝 Register New Complaint</h1>

      <div className="card" style={{ maxWidth: "700px" }}>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1.5rem" }}>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                name="name"
                placeholder="Rahul Kumar"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                placeholder="rahul@gmail.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Complaint Title *</label>
            <input
              name="title"
              placeholder="e.g. Water Leakage Issue near Market"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              placeholder="Describe the complaint in detail..."
              value={form.description}
              onChange={handleChange}
              required
              style={{ minHeight: "120px" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1.5rem" }}>
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange} required>
                <option value="">Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Location *</label>
              <input
                name="location"
                placeholder="e.g. Ghaziabad, Sector 14"
                value={form.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="spinner"></span> Submitting...</> : "Submit Complaint"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/complaints")}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintForm;
