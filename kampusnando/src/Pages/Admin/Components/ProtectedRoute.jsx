import { Navigate } from "react-router-dom";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const ProtectedRoute = ({ children, requiredPermission }) => {
  const { user } = useAuthStateContext();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requiredPermission && (!user.permission || !user.permission.includes(requiredPermission))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
