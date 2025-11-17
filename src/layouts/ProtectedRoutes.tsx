import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type Props = {
  children: React.ReactNode;
  roles?: string[];
};

function ProtectedRoute({ children, roles }: Props) {
  const { token, roles: userRoles } = useAuth();

  if (!token) return <Navigate to="/login" />;

  if (roles && !roles.some((role) => userRoles?.includes(role))) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;