import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ComplaintForm from "./pages/ComplaintForm";
import ComplaintList from "./pages/ComplaintList";
import ComplaintStatus from "./pages/ComplaintStatus";
import AIAnalysis from "./pages/AIAnalysis";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route path="/complaints" element={<ProtectedRoute><ComplaintList /></ProtectedRoute>} />
          <Route path="/complaints/new" element={<ProtectedRoute><ComplaintForm /></ProtectedRoute>} />
          <Route path="/complaints/status/:id" element={<ProtectedRoute><ComplaintStatus /></ProtectedRoute>} />
          <Route path="/ai-analysis" element={<ProtectedRoute><AIAnalysis /></ProtectedRoute>} />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/complaints" replace />} />
          <Route path="*" element={<Navigate to="/complaints" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
