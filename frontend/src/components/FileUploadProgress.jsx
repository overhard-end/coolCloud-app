import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';
import {
  Avatar,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import { Cancel, Check } from '@mui/icons-material';

export function FileUploadProgress() {
  const dispatch = useDispatch();
  const { files, currentUploadingFile, chunks, currentChunk, lastUploadedFiles } = useSelector(
    (state) => state.filesReducer.uploadFile,
  );

  let uploadingFiles = files;

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
            <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }} key={index}>
              <ListItemAvatar>
                <Avatar>
                  <Box sx={{ position: 'absolute', display: 'inline-flex' }}>
                    <CircularProgress
                      variant="determinate"
                      value={
                        currentUploadingFile.name === file.name
                          ? percent
                          : lastUploadedFiles.filter((lastFile) => lastFile.name === file.name)
                              .length > 0
                          ? 100
                          : 0
                      }
                    />
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
                        {`${
                          currentUploadingFile.name === file.name
                            ? percent
                            : lastUploadedFiles.filter((lastFile) => lastFile.name === file.name)
                                .length > 0
                            ? 100
                            : 0
                        }%`}
                      </Typography>
                    </Box>
                  </Box>
                </Avatar>
              </ListItemAvatar>

              {/* <ListItemIcon>{fileIcon(file.exptention)}</ListItemIcon> */}

              <ListItemText>{file.name}</ListItemText>

              {lastUploadedFiles.filter((lastFile) => lastFile.name === file.name).length > 0 ? (
                <IconButton edge="end" disabled>
                  <Check />
                </IconButton>
              ) : (
                <IconButton
                  edge="end"
                  aria-label="cancel"
                  onClick={() => deleteFileFromUpload(file)}>
                  <Cancel />
                </IconButton>
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
