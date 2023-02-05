import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Private = ({ children }) => {
  const accessToken = useSelector((state) => state.userReducer.accessToken);

  if (!accessToken) return <Navigate to="/login" replace />;

  return children ? children : <Outlet />;
};
export default Private;
