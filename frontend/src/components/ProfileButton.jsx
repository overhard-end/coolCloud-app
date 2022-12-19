import { AccountCircle, Settings } from '@mui/icons-material';
import { Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
export const ProfileButton = () => {
  const [anchorEl, setAchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  function OpenHandler(event) {
    setAchorEl(event.currentTarget);
  }
  function CloseHandler(event) {
    setAchorEl(null);
  }
  return (
    <div>
      <IconButton onClick={OpenHandler} id="profileButton" aria-controls="profileMenu">
        <Avatar />
      </IconButton>
      <Menu onClose={CloseHandler} anchorEl={anchorEl} id="profileMenu" open={open}>
        <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem onClick={CloseHandler}>
            <AccountCircle />
            Профиль
          </MenuItem>
        </Link>
        <Link to="/settings" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem onClick={CloseHandler}>
            <Settings />
            Настройки
          </MenuItem>
        </Link>
      </Menu>
    </div>
  );
};
