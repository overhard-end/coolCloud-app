import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

import { Cloud, Login } from '@mui/icons-material';
import { login } from '../redux/actions/userAction';

import sound from '../assets/error.mp3';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { UserAlert } from '../components/UserAlert';

export const SignIn = () => {
  const dispatch = useDispatch();
  const errorMessage = useSelector((state) => state.userReducer.errorMessage);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const errorSound = new Audio(sound);

  const handleLogin = () => {
    if (errorMessage.length > 0) return;
    if (!email || !password) {
      errorSound.play();
      const errorAction = [{ param: 'error', msg: 'Please enter all required fields' }];
      return dispatch({ type: 'USER_MESSAGE', payload: errorAction });
    }
    dispatch(login(email, password));
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
        <Typography variant="h4"> Вход</Typography>

        <TextField
          size="small"
          onClick={() => dispatch({ type: 'USER_MESSAGE', payload: [] })}
          onChange={(e) => setEmail(e.target.value)}
          label="Email"
          variant="outlined"
          type="email"
          error={errorMessage.length ? true : false}
        />
        <TextField
          size="small"
          onClick={() => dispatch({ type: 'USER_MESSAGE', payload: [] })}
          onChange={(e) => setPassword(e.target.value)}
          label="Password"
          variant="outlined"
          type="password"
          error={errorMessage.length ? true : false}
        />
        <Button onClick={() => handleLogin()} id="Login" label="Login" variant="outlined">
          Войти
          <Login />
        </Button>
        <Link to="/registration">Регистрация</Link>
      </Box>
    </>
  );
};
