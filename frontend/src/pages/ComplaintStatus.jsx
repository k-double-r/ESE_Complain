import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

const STATUSES = ["Pending", "In Progress", "Resolved", "Rejected"];

const ComplaintStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const { data } = await API.get(`/api/complaints/${id}`);
        setComplaint(data);
        setStatus(data.status);
      } catch {
        setMessage({ type: "error", text: "Complaint not found" });
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id]);

  const handleUpdate = async () => {
    setUpdating(true);
    setMessage({ type: "", text: "" });
    try {
      const { data } = await API.put(`/api/complaints/${id}`, { status });
      setComplaint(data.complaint);
      setMessage({ type: "success", text: "✅ Status updated successfully!" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Update failed" });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "3rem" }}>Loading...</div>;

  if (!complaint) return (
    <div className="container" style={{ paddingTop: "2rem" }}>
      <div className="alert alert-error">Complaint not found.</div>
      <button className="btn btn-secondary" onClick={() => navigate("/complaints")}>← Back</button>
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
        <button className="btn btn-secondary" onClick={() => navigate("/complaints")}>← Back</button>
        <h1 style={{ marginBottom: 0 }}>✏️ Update Complaint Status</h1>
      </div>

      {/* Complaint Details */}
      <div className="card">
        <h2>Complaint Details</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {[
              ["Complaint ID", complaint._id],
              ["Title", complaint.title],
              ["Submitted By", complaint.name],
              ["Email", complaint.email],
              ["Category", complaint.category],
              ["Location", complaint.location],
              ["Submitted On", new Date(complaint.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })],
            ].map(([label, value]) => (
              <tr key={label} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "0.6rem 0", fontWeight: 600, color: "#374151", width: "160px" }}>{label}</td>
                <td style={{ padding: "0.6rem 0", color: "#4b5563" }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: "1rem" }}>
          <p style={{ fontWeight: 600, color: "#374151", marginBottom: "0.3rem" }}>Description</p>
          <p style={{ color: "#4b5563", background: "#f9fafb", padding: "0.8rem", borderRadius: "6px", lineHeight: 1.6 }}>{complaint.description}</p>
        </div>
      </div>

      {/* Status Update */}
      <div className="card">
        <h2>Update Status</h2>
        {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

        <p style={{ color: "#6b7280", marginBottom: "1rem" }}>Current status: <strong>{complaint.status}</strong></p>

        <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              style={{
                padding: "0.6rem 1.2rem",
                borderRadius: "8px",
                border: "2px solid",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.9rem",
                transition: "all 0.15s",
                borderColor: status === s ? "#4f46e5" : "#d1d5db",
                background: status === s ? "#4f46e5" : "white",
                color: status === s ? "white" : "#374151",
              }}
            >
              {s}
            </button>
          ))}
        </div>

        <button
          className="btn btn-primary"
          onClick={handleUpdate}
          disabled={updating || status === complaint.status}
        >
          {updating ? <><span className="spinner"></span> Updating...</> : "Save Changes"}
        </button>
      </div>

      {/* AI Analysis Preview */}
      {complaint.aiAnalysis?.priority && (
        <div className="card">
          <h2>🤖 AI Analysis Results</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={{ background: "#f9fafb", padding: "1rem", borderRadius: "8px" }}>
              <p style={{ fontWeight: 600, marginBottom: "0.3rem" }}>Priority</p>
              <span className={`badge badge-${complaint.aiAnalysis.priority.toLowerCase()}`}>{complaint.aiAnalysis.priority}</span>
            </div>
            <div style={{ background: "#f9fafb", padding: "1rem", borderRadius: "8px" }}>
              <p style={{ fontWeight: 600, marginBottom: "0.3rem" }}>Recommended Department</p>
              <p style={{ color: "#4b5563" }}>{complaint.aiAnalysis.department}</p>
            </div>
          </div>
          {complaint.aiAnalysis.summary && (
            <div style={{ marginTop: "1rem", background: "#f9fafb", padding: "1rem", borderRadius: "8px" }}>
              <p style={{ fontWeight: 600, marginBottom: "0.3rem" }}>AI Summary</p>
              <p style={{ color: "#4b5563", lineHeight: 1.6 }}>{complaint.aiAnalysis.summary}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComplaintStatus;
