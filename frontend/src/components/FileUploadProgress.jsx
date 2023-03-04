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
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import { Cancel, Check } from '@mui/icons-material';
import { SET_UPLOAD, UPLOAD_DONE } from '../redux/actions/types';

export function FileUploadProgress() {
  const dispatch = useDispatch();
  const { files, currentFile, uploadProgress, hashProgress, uploadedFiles } = useSelector(
    (state) => state.uploadReducer,
  );

  let uploadingFiles = files;

  const percent = uploadProgress;

  function deleteFileFromUpload(targetFile) {
    if (targetFile === 'all') return dispatch({ type: UPLOAD_DONE });
    uploadingFiles = uploadingFiles.filter((file) => {
      return file.name !== targetFile.name;
    });
    dispatch({ type: SET_UPLOAD, payload: uploadingFiles });
  }
  console.log(hashProgress);
  return (
    <Container sx={{ position: 'absolute' }} maxWidth="lg">
      <Dialog open={uploadingFiles.length > 0 ? true : false}>
        <DialogTitle> Uploading </DialogTitle>
        <List disablePadding>
          {uploadingFiles.map((file, index) => (
            <ListItem
              sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}
              key={index}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress variant="determinate" value={hashProgress} />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary">{`${hashProgress}%`}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <ListItemAvatar>
                  <Avatar>
                    <Box sx={{ position: 'absolute', display: 'inline-flex' }}>
                      <CircularProgress
                        variant="determinate"
                        value={
                          currentFile.name === file.name
                            ? percent
                            : uploadedFiles.filter((lastFile) => lastFile.name === file.name)
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
                            currentFile.name === file.name
                              ? percent
                              : uploadedFiles.filter((lastFile) => lastFile.name === file.name)
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

                {uploadedFiles.filter((lastFile) => lastFile.name === file.name).length > 0 ? (
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
              </Box>
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
