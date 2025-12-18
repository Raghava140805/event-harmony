import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOrganizer?: boolean;
}

export function ProtectedRoute({ children, requireOrganizer = false }: ProtectedRouteProps) {
  const { user, loading, isOrganizer } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireOrganizer && !isOrganizer) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
