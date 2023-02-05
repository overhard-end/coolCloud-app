import { AccountCircle, Settings } from '@mui/icons-material';
import { Avatar, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../redux/actions/userAction';

export const ProfileMenu = () => {
  const userEmail = useSelector((state) => state.userReducer.email);
  const dispatch = useDispatch();
  const [anchorEl, setAchorEl] = useState(null);
  const [open, setOpen] = useState(false);

  const openProfileMenu = (e) => {
    setAchorEl(e.currentTarget);
    setOpen(true);
  };

  return (
    <>
      <IconButton onClick={(e) => openProfileMenu(e)} aria-controls="profileMenu">
        <Avatar src="https://avatars.githubusercontent.com/u/76556579?s=400&u=57715db8888294fc30e2e355c32a048e8a167c5c&v=4" />
        <Typography ml="10px" color="white" variant="button">
          {userEmail}
        </Typography>
      </IconButton>
      <Menu onClose={() => setOpen(false)} anchorEl={anchorEl} id="profileMenu" open={open}>
        <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem>
            <AccountCircle />
            Профиль
          </MenuItem>
        </Link>
        <Link to="/settings" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem>
            <Settings />
            Настройки
          </MenuItem>
        </Link>
        <MenuItem onClick={() => dispatch(logout())}>
          <Settings />
          Выход
        </MenuItem>
      </Menu>
    </>
  );
};
