import React from 'react';
import { AppBar, Toolbar, InputBase, Button } from '@mui/material';

import { styled, alpha } from '@mui/material/styles';

import { ProfileButton } from './ProfileButton';
import SearchIcon from '@mui/icons-material/Search';
import MenuTools from './MenuTools';
import { Add } from '@mui/icons-material';

export default function Header() {
  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));

  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed" color="primary">
      <div className="AppHeader">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Button
              sx={{ borderRadius: '50px' }}
              startIcon={<Add />}
              variant="outlined"
              color="inherit"
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}>
              Создать
            </Button>

            <MenuTools anchorEl={anchorEl} openMenu={open} handleClose={handleClose} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Search sx={{ margin: '10px', minWidth: '150px', marginLeft: '10px' }}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
            </Search>
            <ProfileButton />
          </div>
        </Toolbar>
      </div>
    </AppBar>
  );
}
