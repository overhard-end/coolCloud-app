import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

import { Cloud, Login } from '@mui/icons-material';
import { registration } from '../redux/actions/userAction';

import sound from '../assets/error.mp3';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { UserAlert } from '../components/UserAlert';

export const SignUp = () => {
  const dispatch = useDispatch();
  const errorMessage = useSelector((state) => state.userReducer.errorMessage);
  const [user, setUser] = useState({ email: '', password: '', confirmPassword: '' });

  const errorSound = new Audio(sound);

  const handleRegistration = () => {
    if (errorMessage.length > 0) return;
    if (!user.email || !user.password || !user.confirmPassword) {
      errorSound.play();
      const errorAction = [{ param: 'error', msg: 'Please enter all required fields' }];
      return dispatch({ type: 'USER_MESSAGE', payload: errorAction });
    }
    if (!(user.password === user.confirmPassword)) {
      const errorAction = [{ param: 'error', msg: 'Password dont match to confirm password' }];
      return dispatch({ type: 'USER_MESSAGE', payload: errorAction });
    }
    const { email, password } = user;
    dispatch(registration(email, password));
  };

  return (
    <>
      <Typography
        color="primary"
        sx={{ fontWeight: 'bold', paddingBottom: '3px' }}
        variant="h4"
        display="block"
        gutterBottom>
        CoolCloud
        <Cloud fontSize="large" />
      </Typography>

      <Box
        component="form"
        display="flex"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
        minHeight="80vh"
        sx={{
          '& .MuiTextField-root': { m: 1 },
          '& button': { m: 1 },
        }}
        noValidate
        autoComplete="off">
        <UserAlert />
        <Typography variant="h4"> Регистрация</Typography>

        <TextField
          size="small"
          onClick={() => dispatch({ type: 'USER_MESSAGE', payload: [] })}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          label="Email"
          variant="outlined"
          type="email"
          error={errorMessage.length ? true : false}
        />
        <TextField
          size="small"
          onClick={() => dispatch({ type: 'USER_MESSAGE', payload: [] })}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          label="Password"
          variant="outlined"
          type="password"
          error={errorMessage.length ? true : false}
        />
        <TextField
          size="small"
          onClick={() => dispatch({ type: 'USER_MESSAGE', payload: [] })}
          onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
          label="Confirm password"
          variant="outlined"
          type="password"
          error={errorMessage.length ? true : false}
        />
        <Button onClick={() => handleRegistration()} id="Login" label="Login" variant="outlined">
          Войти
          <Login />
        </Button>
        <Link to="/login">Вход</Link>
      </Box>
    </>
  );
};
