import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function OnlyAdminPrivateRoute() {
  // Get the currentUser from the Redux store
  const { currentUser } = useSelector((state) => state.user);

  // If currentUser exists and is an admin, render the child components
  // Otherwise, redirect to the sign-in page
  return currentUser && currentUser.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to='/sign-in' />
  );
}
