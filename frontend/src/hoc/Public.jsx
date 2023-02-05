import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Public = ({ children }) => {
  const accessToken = useSelector((state) => state.userReducer.accessToken);

  if (accessToken) return <Navigate to="/" />;

  return children ? children : <Outlet />;
};
export default Public;
