import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

const PriorityIcon = ({ priority }) => {
  const map = { High: "🔴", Medium: "🟡", Low: "🟢" };
  return <span>{map[priority] || "⚪"}</span>;
};

const AIAnalysis = () => {
  const [searchParams] = useSearchParams();
  const complaintId = searchParams.get("id");
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!complaintId);
  const [error, setError] = useState("");

  // Fetch existing complaint if ID provided
  useEffect(() => {
    if (!complaintId) return;
    const fetchComplaint = async () => {
      try {
        const { data } = await API.get(`/api/complaints/${complaintId}`);
        setComplaint(data);
      } catch {
        setError("Complaint not found");
      } finally {
        setFetching(false);
      }
    };
    fetchComplaint();
  }, [complaintId]);

  const runAnalysis = async () => {
    if (!complaint) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await API.post("/api/ai/analyze", { complaintId: complaint._id });
      setComplaint((prev) => ({ ...prev, aiAnalysis: data.aiAnalysis }));
    } catch (err) {
      setError(err.response?.data?.message || "AI analysis failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div style={{ textAlign: "center", padding: "3rem" }}>Loading complaint...</div>;

  return (
    <div className="container" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
        <button className="btn btn-secondary" onClick={() => navigate("/complaints")}>← Back</button>
        <h1 style={{ marginBottom: 0 }}>🤖 AI Complaint Analysis</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Complaint summary */}
      {complaint && (
        <div className="card">
          <h2>Complaint: {complaint.title}</h2>
          <p style={{ color: "#6b7280", fontSize: "0.85rem", marginBottom: "0.8rem" }}>
            👤 {complaint.name} • 📍 {complaint.location} • 🏷️ {complaint.category}
          </p>
          <p style={{ color: "#374151", lineHeight: 1.6, marginBottom: "1.2rem" }}>{complaint.description}</p>

          <button
            className="btn btn-primary"
            onClick={runAnalysis}
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner"></span> AI is analyzing...</>
            ) : complaint.aiAnalysis?.priority ? (
              "🔄 Re-run Analysis"
            ) : (
              "🤖 Run AI Analysis"
            )}
          </button>
        </div>
      )}

      {/* AI Results */}
      {complaint?.aiAnalysis?.priority && (
        <>
          <h2 style={{ margin: "1.5rem 0 1rem" }}>Analysis Results</h2>

          {/* Priority & Department */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div className="card" style={{ background: "linear-gradient(135deg, #fff 0%, #fef3f2 100%)", borderLeft: "4px solid #ef4444" }}>
              <h3 style={{ marginBottom: "0.8rem" }}>⚡ Priority Level</h3>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.5rem", fontWeight: 700 }}>
                <PriorityIcon priority={complaint.aiAnalysis.priority} />
                <span style={{ color: complaint.aiAnalysis.priority === "High" ? "#dc2626" : complaint.aiAnalysis.priority === "Medium" ? "#d97706" : "#059669" }}>
                  {complaint.aiAnalysis.priority}
                </span>
              </div>
            </div>

            <div className="card" style={{ background: "linear-gradient(135deg, #fff 0%, #eff6ff 100%)", borderLeft: "4px solid #3b82f6" }}>
              <h3 style={{ marginBottom: "0.8rem" }}>🏢 Responsible Department</h3>
              <p style={{ fontSize: "1.1rem", fontWeight: 600, color: "#1d4ed8" }}>
                {complaint.aiAnalysis.department}
              </p>
            </div>
          </div>

          {/* Summary */}
          {complaint.aiAnalysis.summary && (
            <div className="card" style={{ background: "linear-gradient(135deg, #fff 0%, #f0fdf4 100%)", borderLeft: "4px solid #10b981" }}>
              <h3 style={{ marginBottom: "0.8rem" }}>📝 AI Summary</h3>
              <p style={{ color: "#374151", lineHeight: 1.7 }}>{complaint.aiAnalysis.summary}</p>
            </div>
          )}

          {/* Auto Response */}
          {complaint.aiAnalysis.autoResponse && (
            <div className="card" style={{ background: "linear-gradient(135deg, #fff 0%, #faf5ff 100%)", borderLeft: "4px solid #8b5cf6" }}>
              <h3 style={{ marginBottom: "0.8rem" }}>💬 Auto-Generated Response to Citizen</h3>
              <div style={{ background: "#f9fafb", padding: "1.2rem", borderRadius: "8px", lineHeight: 1.7, color: "#374151", fontStyle: "italic", borderLeft: "3px solid #8b5cf6" }}>
                "{complaint.aiAnalysis.autoResponse}"
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty state */}
      {complaint && !complaint.aiAnalysis?.priority && !loading && (
        <div className="card" style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
          <p style={{ fontSize: "3rem" }}>🤖</p>
          <p style={{ fontSize: "1.1rem" }}>Click "Run AI Analysis" to get AI-powered insights for this complaint.</p>
        </div>
      )}
    </div>
  );
};

export default AIAnalysis;
