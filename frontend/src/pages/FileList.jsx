import { ArrowDownward, SubdirectoryArrowLeft } from '@mui/icons-material';
import {
  Box,
  CircularProgress,
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
import { FileItem } from '../components/FileItem';
import { connect } from 'react-redux';
import { fetchFiles, returnFile } from '../redux/actions/filesActions';
import { formatSizeUnits } from '../utils/sizeFormat';
import Header from '../components/Header';
import { SideBar } from '../components/SideBar';

const FileList = ({ isLoading, fileStack, dispatch, selectedFile, totalSizeByte }) => {
  useEffect(() => {
    dispatch(fetchFiles());
  }, [dispatch]);
  const size = formatSizeUnits(totalSizeByte);

  const maxSize = 1;
  const tatalSizeGB = totalSizeByte / 1073741824;
  const progressSize = (tatalSizeGB / maxSize) * 100;
  console.log(fileStack);
  const selectedFilePath = fileStack[fileStack.length - 1]?.path.split('/');

  return (
    <>
      <Header />
      <SideBar />
      <Container
        sx={{
          paddingTop: '100px',
          minWidth: '390px',
        }}>
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
            <ListItemButton onClick={() => dispatch(returnFile())} sx={{ width: '150px' }}>
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
              {selectedFilePath
                ? selectedFilePath.map((path, index) => (
                    <Box key={index} sx={{ display: 'inline-block' }}>
                      <>
                        <ListItemButton
                          sx={{
                            margin: 0,
                            padding: 0,
                            color: 'grey',
                          }}>
                          <Typography variant="caption"> {`${path}/`} </Typography>
                        </ListItemButton>
                      </>
                    </Box>
                  ))
                : ''}
            </List>

            <ListItem disableGutters={true}>
              <ListItemIcon>
                <ArrowDownward />
              </ListItemIcon>
              <ListItemText secondary="Название" />

              <ListItemText sx={{ padding: '0 10px', textAlign: 'right' }} secondary="Размер" />
            </ListItem>
            <Divider />
          </Box>
        </Box>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Grid item xs={12} md={6}>
            <List>
              {selectedFile.children
                ? selectedFile.children.map((file, index) => (
                    <FileItem file={file} key={index} dispatch={dispatch} />
                  ))
                : ''}
            </List>
          </Grid>
        )}
      </Container>
    </>
  );
};

const mapStateToProps = (state) => ({
  totalSizeByte: state.folderReducer.totalSize,
  selectedFile: state.folderReducer.selectedFile,
  fileStack: state.folderReducer.fileStack,
  isLoading: state.folderReducer.isLoading,
});

const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(FileList);
