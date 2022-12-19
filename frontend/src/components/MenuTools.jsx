import { CreateNewFolder, DriveFolderUpload, UploadFile } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  Menu,
  MenuItem,
  TextField,
} from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';
import { addFile, fetchFiles } from '../redux/actions/actions';

const MenuTools = ({ addFileHandler, anchorEl, openMenu, handleClose }) => {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState(false);
  const [textValidation, setTextValidation] = React.useState(false);

  function handleOpenDialog() {
    setOpen(true);
  }
  function handleCloseDialog() {
    setOpen(false);
  }
  function ValidateFolderName(value) {
    if (value.length <= 0) {
      setTextValidation(true);
    }
    setTextValidation(false);
    setText(value);
  }
  function createFolder() {
    if (text.length >= 1) {
      setOpen(false);
      handleClose();
      setText('');
    } else {
      setTextValidation(true);
    }
  }

  function uploadSelectFile(e) {
    const file = e.target.files;

    addFileHandler(file);
  }

  return (
    <div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}>
        <MenuItem id="create-new-folder" onClick={handleOpenDialog}>
          <CreateNewFolder />
          Создать папку
        </MenuItem>
        <Dialog aria-labelledby="create-new-folder" open={open} onClose={handleCloseDialog}>
          <DialogContent>
            <DialogContentText>Не давай тупое название по типу 'аааа' или '5555'</DialogContentText>
            <TextField
              error={textValidation}
              autoFocus
              margin="dense"
              id="folderName"
              label="Введите название папки*"
              helperText={textValidation ? 'Поле не должо быть пустым !' : ''}
              type="text"
              fullWidth
              onChange={(e) => ValidateFolderName(e.target.value)}
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={createFolder}>Создать </Button>
          </DialogActions>
        </Dialog>
        <Divider />
        <MenuItem variant="contained" component="label">
          <input
            id="filesInput"
            onChange={(e) => uploadSelectFile(e)}
            onClick={(e) => (e.target.value = '')}
            hidden
            accept="file/*"
            multiple
            type="file"
          />
          <UploadFile />
          Загрузить файл
        </MenuItem>
        <MenuItem variant="contained" component="label">
          <input
            id="dirInput"
            onChange={(e) => uploadSelectFile(e)}
            onClick={(e) => (e.target.value = '')}
            hidden
            webkitdirectory="true"
            directory="true"
            multiple
            type="file"
          />
          <DriveFolderUpload />
          Загрузить папку
        </MenuItem>
      </Menu>
    </div>
  );
};
function mapDispatchToProps(dispatch) {
  return {
    addFileHandler: (file) => {
      console.log(file);
      addFile(dispatch, file);
    },
    fetchFilesHandler: () => {
      fetchFiles(dispatch);
    },
  };
}

export default connect(null, mapDispatchToProps)(MenuTools);
