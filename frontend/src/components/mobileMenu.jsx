import { Drawer, Menu } from '@mui/material';
import React from 'react';
import MenuTools from './MenuTools';
import { SideBar } from './SideBar';

export const MobileMenu = (props) => {
  return (
    <div>
      <Drawer
        id="mobile-menu"
        enchorEl={props.enchorEl}
        open={props.openMenu}
        onClose={props.handleClose}
        MenuListProps="area-labelledby:mobile-button">
        <SideBar />
      </Drawer>
    </div>
  );
};
