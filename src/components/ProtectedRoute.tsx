import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore, type AuthRole } from "@/store/authStore";
import { PageLoader } from "@/components/ui/PageLoader";

interface ProtectedRouteProps {
  requiredRole?: AuthRole;
}

export const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const location = useLocation();
  const session = useAuthStore((state) => state.session);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  if (!hasHydrated) {
    return <PageLoader />;
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requiredRole && session.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
