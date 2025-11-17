import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type Props = {
  children: React.ReactNode;
};

function PublicRoute({ children }: Props) {
  const { token, roles } = useAuth();

  // Si está logueado como admin, redirige al panel
  if (token && roles?.includes("ROLE_ADMIN")) {
    return <Navigate to="/admin" />;
  }

  // Si  es admin o no está logueado, muestra el layout público
  return <>{children}</>;
}

export default PublicRoute;




