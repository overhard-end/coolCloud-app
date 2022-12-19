import {
  AccessTime,
  Article,
  AudioFile,
  AutoDelete,
  Cloud,
  Folder,
  Image,
  VisibilityOff,
} from '@mui/icons-material';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

export const SideBar = () => {
  const [selectedIndex, setSelectedIndex] = React.useState();

  const drawerWidth = 240;
  const drawer1 = (
    <>
      <Toolbar />
      <Link
        to="/"
        style={{
          left: 27,
          top: 12,
          marginBottom: '10px',
          position: 'fixed',
          textDecoration: 'none',
          color: {},
        }}>
        <Typography
          color="primary"
          sx={{ fontWeight: 'bold', paddingBottom: '3px' }}
          variant="h4"
          display="block"
          gutterBottom>
          CoolCloud
          <Cloud fontSize="large" />
        </Typography>
      </Link>
      <Divider />
      <List>
        {['Недавние', 'Изображения', 'Документы', 'Аудио', 'Все файлы', 'Корзина', 'Скрытые'].map(
          (text, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                selected={selectedIndex === index}
                onClick={() => setSelectedIndex(index)}>
                <ListItemIcon>
                  {index === 0 ? <AccessTime /> : ''}
                  {index === 1 ? <Image /> : ''}
                  {index === 2 ? <Article /> : ''}
                  {index === 3 ? <AudioFile /> : ''}
                  {index === 4 ? <Folder /> : ''}
                  {index === 5 ? <AutoDelete /> : ''}
                  {index === 6 ? <VisibilityOff /> : ''}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ),
        )}
      </List>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders">
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open>
        {drawer1}
      </Drawer>
    </Box>
  );
};
