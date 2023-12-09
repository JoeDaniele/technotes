import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const RequireAuth = ({ allowedRoles }) => {
  const location = useLocation();
  const { roles } = useAuth();

  const content = roles.some((role) => allowedRoles.includes(role)) ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );

  return content;
};
export default RequireAuth;

/**
 * Getting location from useLoc Hook
 * Getting roles[] from useAuth Hook
 *
 * Defining content (it will equal the ternary)
 * roles.array and .some() Boolean Method - IF true once, it will return * true
 *
 * allowedRoles array passed in, calling .includes() on that and checking each role. If allowedRoles includes one of the roles that the user has from useAuth, then we're getting TRUE and return the Outlet</>
 *
 * Outlet</> is wrapper to protect the routes inside, ensuring they are only sent for the allowedRoles.
 *
 * Otherwise -- we'll use Navigate, and we'll send someone trying to access a route they're not allowed to, back to the LOGIN page.
 *
 * getting loc from useLocation, passing that in as the 'from:' for our state. Then we use Replace -- replace allows for user to use the back button and return to previous pages, if they are already logged in.
 *
 */
