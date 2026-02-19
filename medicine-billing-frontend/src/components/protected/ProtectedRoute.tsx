import { Navigate, Outlet } from "react-router-dom";
import { useMe } from "../../hooks/useMe";

type ProtectedRouteProps = {
  roles?: string[];
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles }) => {
  const { data: me, isLoading } = useMe();

  if (isLoading) return null;

  // not logged in
  if (!me) {
    return <Navigate to="/login" replace />;
  }

  // role based access
  if (roles && !roles.includes(me.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
