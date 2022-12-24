import {
  Compress,
  DocumentScannerOutlined,
  FilePresent,
  Folder,
  FormatListNumbered,
  Http,
  InsertPhoto,
  Link,
  MusicNote,
  PlayArrow,
  Settings,
  TextSnippet,
} from '@mui/icons-material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { IconButton, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import React from 'react';
import { FileContextMenu } from './FileContextMenu';
import { undoFile, redoFile } from '../redux/actions/filesActions';

export const FileItem = ({ file, formatSizeUnits, dispatch }) => {
  const fileIcon = (file) => {
    switch (file.extension) {
      case '.pdf':
        return <PictureAsPdfIcon />;
      case '.jpg':
        return <InsertPhoto />;
      case '.png':
        return <InsertPhoto />;
      case '.gif':
        return <InsertPhoto />;
      case '.lnk':
        return <Link />;
      case '.url':
        return <Http />;
      case '.doc':
        return <DocumentScannerOutlined />;
      case '.docx':
        return <DocumentScannerOutlined />;
      case '.xlsx':
        return <FormatListNumbered />;
      case '.pptx':
        return <FilePresent />;
      case '.txt':
        return <TextSnippet />;
      case '.ini':
        return <Settings />;
      case '.exe':
        return <PlayArrow />;
      case '.rar':
        return <Compress />;
      case '.mp3':
        return <MusicNote />;
      case '.m4a':
        return <MusicNote />;

      default:
        return <Folder />;
    }
  };

  const fileSize = formatSizeUnits(file.size);
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState('');

  function handleOpenContextMenu(e) {
    e.preventDefault();
    if (!e.currentTarget === anchorEl) {
      setOpen(false);
    }
    setAnchorEl(e.currentTarget);
    setOpen(true);
  }
  function handleCloseContextMenu() {
    setAnchorEl(null);
    setOpen(false);
  }

  return (
    <>
      <ListItemButton
        onClick={() => dispatch(undoFile(file))}
        onContextMenu={(e) => handleOpenContextMenu(e)}
        disableGutters={true}
        
        divider={true}
        dense={true}
        sx={{ marginRight: '70px' }}
        >
        <ListItemIcon>{fileIcon(file)}</ListItemIcon>
        <ListItemText
          primary={file.name}
          sx={{ width: '80px' }}
          primaryTypographyProps={{
            variant: 'subtitle1',
            style: {
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
          }}
        />

        <ListItemText
          secondaryTypographyProps={{ variant: 'overline' }}
          sx={{ padding: '0 10px' }}
          secondary={file.date}
        />
        <ListItemText
          secondaryTypographyProps={{ variant: 'overline' }}
          sx={{ padding: '0 10px', display: 'flex', justifyContent: 'right' }}
          secondary={fileSize}
        />
      </ListItemButton>

      <FileContextMenu
        anchorEl={anchorEl}
        handleCloseContextMenu={handleCloseContextMenu}
        open={open}
        file={file}
      />
    </>
  );
};
