import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
const Private = ({ children }) => {
  const isAuth = useSelector((state) => state.userReducer.isAuth);
  if (!isAuth) return <Navigate to="/login" replace />;

  return children ? children : <Outlet />;
};
export default Private;
