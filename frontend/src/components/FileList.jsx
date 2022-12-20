import { ArrowDownward, SubdirectoryArrowLeft } from '@mui/icons-material';
import {
  Box,
  Container,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { FileItem } from './FileItem';
import { connect } from 'react-redux';
import { fetchFiles, selectFile, returnFile } from '../redux/actions/filesActions';
import img1 from '../img/12.jpg';

const FileList = ({ files, dispatch, selectedFile, fileStack, totalSizeByte }) => {
  function openFile(file) {
    if (file.children && file.children.length > 0) {
      selectFile(file, dispatch);
    }
  }

  useEffect(() => {
    fetchFiles(dispatch);
  }, [dispatch]);

  function formatSizeUnits(bytes) {
    if (bytes >= 1073741824) {
      bytes = (bytes / 1073741824).toFixed(2) + ' GB';
    } else if (bytes >= 1048576) {
      bytes = (bytes / 1048576).toFixed(2) + ' MB';
    } else if (bytes >= 1024) {
      bytes = (bytes / 1024).toFixed(2) + ' KB';
    } else if (bytes > 1) {
      bytes = bytes + ' bytes';
    } else if (bytes === 1) {
      bytes = bytes + ' byte';
    } else {
      bytes = '0 bytes';
    }
    return bytes;
  }
  const size = formatSizeUnits(totalSizeByte);

  const selectFilePath = (fileStack) => {
    return fileStack[fileStack.length - 1];
  };
  const selectFilePathSplit = selectFilePath(fileStack);
  const pap = selectFilePathSplit?.path.split('/');
  if (pap) {
    pap[0] = 'root';
  }

  const maxSize = 1;
  const tatalSizeGB = totalSizeByte / 1073741824;
  const progressSize = (tatalSizeGB / maxSize) * 100;

  return (
    <Container
      sx={{
        paddingTop: '100px',
        minWidth: '390px',
      }}>
      <iframe
        sandbox="allow-scripts"
        referrerPolicy="origin"
        loading="eager  "
        id="inlineFrameExample"
        title="Inline Frame Example"
        width=""
        height="200"
        src={img1}></iframe>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{}}>
          <LinearProgress variant="determinate" value={progressSize} />
          <Typography variant="caption" component="div" color="text.secondary">
            {`Использовано ${size}  из ${maxSize}ГБ`}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}>
        <Box sx={{ width: '100%' }}>
          <ListItemButton onClick={() => returnFile(dispatch)} sx={{ width: '150px' }}>
            <SubdirectoryArrowLeft />
            <Typography
              sx={{
                fontWeight: '600',
                fontSize: '15px',
              }}>
              Вернуться
            </Typography>
          </ListItemButton>

          <List sx={{ display: 'inline-block' }}>
            {pap
              ? pap.map((path, index) => (
                  <Box key={index} sx={{ display: 'inline-block' }}>
                    <>
                      <ListItemButton
                        sx={{
                          margin: 0,
                          padding: 0,
                          color: 'grey',
                        }}>
                        <Typography variant="caption"> {path} /</Typography>
                      </ListItemButton>
                    </>
                  </Box>
                ))
              : ''}
          </List>

          <ListItem disableGutters={true} disablePadding={true}>
            <ListItemIcon>
              <ArrowDownward />
            </ListItemIcon>
            <ListItemText secondary="Название" />

            <ListItemText sx={{ padding: '0 10px', textAlign: 'right' }} secondary="Размер" />
          </ListItem>
          <Divider />
        </Box>
      </Box>

      <Grid item xs={12} md={6}>
        <List>
          {selectedFile.children
            ? selectedFile.children.map((file) => (
                <FileItem
                  id="fileItem"
                  formatSizeUnits={formatSizeUnits}
                  file={file}
                  key={file.name}
                  openFile={openFile}
                  returnFile={returnFile}
                />
              ))
            : ''}
        </List>
      </Grid>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  totalSizeByte: state.folderReducer.totalSize,
  files: state.folderReducer.files,
  selectedFile: state.folderReducer.selectedFile,
  fileStack: state.folderReducer.previousFilesStack,
});

const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(FileList);
