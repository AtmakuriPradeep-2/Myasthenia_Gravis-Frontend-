import { Navigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";

interface RoleGuardedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function RoleGuardedRoute({ children, allowedRoles }: RoleGuardedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
