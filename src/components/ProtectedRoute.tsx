import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  // 1. Get the user and loading state from our Auth hook
  const { user, isLoading } = useAuth();

  // 2. Wait while Firebase is checking auth state
  if (isLoading) {
    return <div className="p-10 text-center text-lg">Loading...</div>;
  }

  // 3. If we're done loading and there IS a user,
  //    render the <Outlet />, which is React Router's
  //    way of saying "render the child page" (e.g., AdminPanelPage)
  if (user) {
    return <Outlet />;
  }

  // 4. If we're done loading and there is NO user,
  //    redirect them to the login page.
  return <Navigate to="/login" replace />;
}