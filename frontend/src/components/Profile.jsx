import { Avatar, Container, Switch, Typography } from '@mui/material';
import React from 'react';

export const Profile = () => {
  return (
    <Container
      sx={{
        paddingLeft: '240px',
        paddingTop: '100px',
      }}>
      <Typography variant="h3">Profile</Typography>
      <Avatar sizes="large"></Avatar>
      <Typography variant="h6">профилю быть</Typography>
      <Switch />
    </Container>
  );
};
