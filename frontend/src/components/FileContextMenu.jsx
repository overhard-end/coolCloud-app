import {
  Delete,
  Download,
  DriveFileRenameOutline,
  Info,
  OpenInBrowser,
  Send,
} from '@mui/icons-material';
import { Menu, MenuItem, Typography } from '@mui/material';
import React from 'react';
import { removeFile } from '../redux/actions/filesActions';

export const FileContextMenu = ({ openFile, file, anchorEl, open, handleCloseContextMenu }) => {
  const contextMenuOptions = [
    { action: openFile, id: 0, name: 'Открыть', icon: <OpenInBrowser /> },
    { id: 1, name: 'Отправить', icon: <Send /> },
    { id: 2, name: 'Скачать', icon: <Download /> },
    { action: removeFile, id: 3, name: 'Удалить', icon: <Delete /> },
    { id: 4, name: 'Показать свойства', icon: <Info /> },
    { id: 5, name: 'Переименовать', icon: <DriveFileRenameOutline /> },
  ];
  console.log(file);
  return (
    <Menu id="lock-menu" anchorEl={anchorEl} open={open} onClose={handleCloseContextMenu}>
      {contextMenuOptions.map((item, index) => (
        <MenuItem dense={true} key={index} onClick={() => item.action(file)}>
          {item.icon}
          <Typography>{item.name}</Typography>
        </MenuItem>
      ))}
    </Menu>
  );
};
