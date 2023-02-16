import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { Cancel, Check } from '@mui/icons-material';

export function FileUploadProgress() {
  const dispatch = useDispatch();
  const { files, currentFile, chunks, currentChunk, uploadedFiles } = useSelector(
    (state) => state.filesReducer.uploadFile,
  );

  let uploadingFiles = files;

  console.log('upload', { files, currentFile, chunks, currentChunk, uploadedFiles });
  const percent = Math.ceil((currentChunk / chunks) * 100);

  function deleteFileFromUpload(targetFile) {
    if (targetFile === 'all') return dispatch({ type: 'UPLOAD_CHANGE', payload: [] });
    uploadingFiles = uploadingFiles.filter((file) => {
      return file.name !== targetFile.name;
    });
    dispatch({ type: 'UPLOAD_CHANGE', payload: uploadingFiles });
  }
  return (
    <Container sx={{ position: 'absolute' }} maxWidth="lg">
      <Dialog open={uploadingFiles.length > 0 ? true : false}>
        <DialogTitle> Uploading </DialogTitle>
        <List disablePadding>
          {uploadingFiles.map((file, index) => (
            <ListItem key={index}>
              {currentFile.name === file.name ? (
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <CircularProgress variant="determinate" value={percent} />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Typography variant="caption" component="div" color="text.secondary">
                      {`${percent}%`}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                ''
              )}

              <ListItemText>{file.name}</ListItemText>
              {uploadedFiles.includes(file.name) ? (
                <Check />
              ) : (
                <ListItemButton onClick={() => deleteFileFromUpload(file)}>
                  <Cancel />
                </ListItemButton>
              )}
            </ListItem>
          ))}
        </List>
        <DialogActions>
          <Button>Cancel Uploading</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
