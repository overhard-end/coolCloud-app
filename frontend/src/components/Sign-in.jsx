import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

import { Cloud } from '@mui/icons-material';
import { login } from '../redux/actions/userAction';

import { useDispatch } from 'react-redux';
import store from '../redux/store';

export const SignIn = () => {
  const dispatch = useDispatch();
  const userStore = store.getState().userReducer.errorMessage.toString();
  const [errorMessage, seteErrorMessage] = useState();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [validate, setValidate] = useState({ email: false, password: false });

  function handleLogin() {
    if (!email) return setValidate({ ...validate, email: 'Email is required !' });
    if (!password) return setValidate({ ...validate, password: 'Password  is required !' });
    dispatch(login(email, password));
    seteErrorMessage(userStore);
  }
  if (errorMessage) return alert(errorMessage);
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
        sx={{ marginTop: '25%', display: 'flex', flexDirection: 'column', width: '200px' }}
        noValidate
        autoComplete="off">
        <Typography variant="h4"> Login</Typography>

        <TextField
          onClick={() => setValidate({ ...validate, email: false })}
          onChange={(e) => setEmail(e.target.value)}
          id="Login"
          label="Login"
          variant="outlined"
          type="email"
          error={validate.email ? true : false}
          helperText={validate ? validate.email : false}
        />

        <TextField
          onClick={() => setValidate({ ...validate, password: false })}
          onChange={(e) => setPassword(e.target.value)}
          id="Password"
          label="Password"
          variant="outlined"
          type="password"
          error={validate.password ? true : false}
          helperText={validate ? validate.password : false}
        />
        <Button onClick={() => handleLogin()} id="Login" label="Login" variant="outlined">
          Sign in
        </Button>
      </Box>
    </>
  );
};
