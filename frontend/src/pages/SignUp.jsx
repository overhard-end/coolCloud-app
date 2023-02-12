import { Cloud, Login } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import UserFront from '@userfront/react';
import { Link } from 'react-router-dom';
export const SignUp = () => {
  UserFront.init('6nz8yppn');
  const SignUpForm = UserFront.build({
    toolId: 'ranrlmo',
  });
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
        flexDirection="column"
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="90vh">
        <SignUpForm />

        <Link to="/sign-in">
          <Button variant="contained" startIcon={<Login />}>
            Sign in
          </Button>
        </Link>
      </Box>
    </>
  );
};
