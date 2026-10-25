import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthenticationContext';
import type { UserRole } from '../services/users/IUser';

interface RoleRouteProps {
  allowedRoles: UserRole[];
}

const RoleRoute = ({ allowedRoles }: RoleRouteProps) => {
  const { role } = useAuth();

  if (role === null) return null;
  if (!allowedRoles.includes(role)) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default RoleRoute;