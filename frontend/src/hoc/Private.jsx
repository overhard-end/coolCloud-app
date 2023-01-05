import { useNavigate } from 'react-router-dom';
import store from '../redux/store';
import { useEffect } from 'react';
import { connect } from 'react-redux';
const Private = (props) => {
  const navigate = useNavigate();
  const isAuth = store.getState()?.userReducer?.isAuth;
  useEffect(() => {
    if (!isAuth) {
      return navigate('/login');
    }
    return { ...props };
  }, [isAuth]);
};

export default Private;
