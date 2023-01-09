import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
const Public = ({ children }) => {
  const isAuth = useSelector((state) => state.userReducer.isAuth);
  if (isAuth) return <Navigate to="/" />;

  return children ? children : <Outlet />;
};
export default Public;
