import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <CenteredNote text="Loading…" />;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function OrganizerRoute() {
  const { user, loading, isOrganizer } = useAuth();
  if (loading) return <CenteredNote text="Loading…" />;
  if (!user || !isOrganizer) return <Navigate to="/" replace />;
  return <Outlet />;
}

export function AdminRoute() {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <CenteredNote text="Loading…" />;
  if (!user || !isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
}

function CenteredNote({ text }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center font-mono text-sm text-mist">
      {text}
    </div>
  );
}
