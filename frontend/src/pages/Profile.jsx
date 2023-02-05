import { ArrowBack, CheckBox, PhotoCamera } from '@mui/icons-material';
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';

import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { ProfileMenu } from '../components/ProfileMenu';

export const Profile = () => {
  const user = useSelector((state) => state.userReducer);

  return (
    <>
      <AppBar>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box display="flex">
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <IconButton color="inherit">
                <ArrowBack fontSize="large" fontWeight="bold" />
              </IconButton>
            </Link>
            <Typography sx={{ fontSize: '20px' }} ml="20px" variant="overline" color="white">
              Профиль
            </Typography>
          </Box>

          <ProfileMenu />
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ marginTop: '100px' }}>
        <Box display="flex" marginBottom="20px" position={'relative'}>
          <Avatar
            src="https://avatars.githubusercontent.com/u/76556579?s=400&u=57715db8888294fc30e2e355c32a048e8a167c5c&v=4"
            sx={{ width: 150, height: 150 }}
          />
          <IconButton
            disableRipple={true}
            sx={{
              borderRadius: '50%',
              position: 'absolute',
              left: '100px',
              top: '100px',
              background: 'white',
            }}>
            <PhotoCamera fontSize="large" />
          </IconButton>
        </Box>
        <Stack spacing={2}>
          <Divider />
          <Box display="flex" justifyContent="space-between">
            <Typography fontSize="20px" variant="overline">
              Email: {user.email}
            </Typography>
            {!user.confirEmail ? (
              <Alert severity="success">Email successfuly confirm</Alert>
            ) : (
              <Alert severity="error">
                Email is not verify Please confirm your adress from mail
              </Alert>
            )}
          </Box>
          <Divider />
          <Box display="flex" justifyContent="space-between">
            <Typography fontSize="20px" variant="overline">
              Change password:
            </Typography>
            <TextField placeholder="New password" />
            <TextField placeholder="Confirm new pass" />
            <Button onClick={() => alert('Password was successfully changed')}> Submit</Button>
          </Box>
        </Stack>
      </Container>
    </>
  );
};
