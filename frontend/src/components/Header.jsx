import React from 'react';
import { AppBar, Box, Toolbar } from '@mui/material';
import { MenuTools } from './MenuTools';
import { SearchField } from './SearchField';
import { ProfileMenu } from './ProfileMenu';
import { AppIcon } from './AppIcon';

export default function Header({}) {
  return (
    <AppBar position="fixed" color="primary" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'right' }}>
        <AppIcon />
        <Box position="absolute" marginLeft="250px" left="0">
          <MenuTools />
        </Box>
        <SearchField />
        <Box marginLeft="20px">
          <ProfileMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
