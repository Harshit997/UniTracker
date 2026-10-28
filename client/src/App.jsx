import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import PlacementsHome from "./pages/placements/PlacementsHome";
import ComingSoon from "./pages/ComingSoon";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/onboarding"
        element={
          <ProtectedRoute requireProfile={false}>
            <Onboarding />
          </ProtectedRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/placements" element={<PlacementsHome />} />
        <Route path="/academics" element={<ComingSoon title="Academics" />} />
        <Route path="/notes" element={<ComingSoon title="Notes" />} />
        <Route path="/exams" element={<ComingSoon title="Exam Prep" />} />
        <Route path="/documents" element={<ComingSoon title="Documents" />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;