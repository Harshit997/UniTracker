import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, requireProfile = true }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireProfile && !user.college) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}

export default ProtectedRoute;