import { Cloud } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import UserFront from '@userfront/react';
import { Link } from 'react-router-dom';

export const SignIn = () => {
  UserFront.init('6nz8yppn');
  const SignInForm = UserFront.build({
    toolId: 'albmdao',
  });

  return (
    <>
      <Typography
        color="primary"
        sx={{ fontWeight: 'bold', paddingBottom: '20px' }}
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
        minHeight="100vh">
        <SignInForm />
        <Link to="/sign-up">
          <Button variant="contained">Sign in</Button>
        </Link>
      </Box>
    </>
  );
};
