import fileService from '../../services/fileService';
import { SET_FILES, SELECT_FILE, RETURN_FILE } from '../actions/types';
import store from '../store';

export function fetchFiles() {
  return async (dispatch) => {
    try {
      const response = await fileService.getFiles();
      if (response.status === 200) {
        return dispatch({ type: SET_FILES, payload: response.data });
      }
    } catch (error) {
      console.log('fethFiles', error);
    }
  };
}

export function uploadFile(files) {
  return async (dispatch) => {
    const originalFileList = [...files];

    let filesArray = [];
    for (let i = 0; i < originalFileList.length; i++) {
      let fileObject = {
        name: files[i].name,
        size: files[i].size,
        type: files[i].type,
        relativePath: files[i].webkitRelativePath,
      };
      filesArray.push(fileObject);
    }

    dispatch({ type: 'UPLOAD_START', payload: filesArray });

    let currentFileIndex = null;
    let currentChunkIndex = null;

    try {
      async function readAndUploadFile() {
        // const selectedFile = store.getState().filesReducer.selectedFile;
        const filesPresentation = store.getState().filesReducer.uploadFile.files;

        const fileListForUploading = originalFileList.filter((originalFile) =>
          filesPresentation.some((file) => originalFile.name === file.name),
        );
        const file = fileListForUploading[currentFileIndex];

        if (!file) {
          dispatch({ type: 'UPLOAD_DONE' });
          return dispatch(fetchFiles());
        }
        const chunkList = fileService.createFileChunk(file);
        console.log(chunkList);
        const fileHash = await fileService.ganerateHash(chunkList);
        console.log(fileHash);
        const formData = new FormData();
        let allPromises = chunkList.map((chunk, index) => {
          formData.append(fileHash + '-' + index, chunk);
          return fileService.sendChunk(formData);
        });
        Promise.all(allPromises)
          .then((responses) => {
            fileService
              .mergeChunks()
              .then(currentFileIndex++)
              .catch((error) => console.log(error));
          })
          .catch(dispatch({ type: 'UPLOAD_DONE' }));
      }

      if (currentFileIndex === null && currentChunkIndex === null) {
        currentFileIndex = 0;
        currentChunkIndex = 0;
        readAndUploadFile();
      }
    } catch (error) {
      console.log(error);
      alert('Something went wrong, please');
    }
  };
}

export function removeFile(file) {
  return async (dispatch) => {
    try {
      const files = {
        path: file.path,
        type: file.type,
      };
      const response = await fileService.removeFiles(files);
      if (response.status === 200) {
        dispatch(fetchFiles());
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export const selectFile = (file) => (dispatch) => {
  const action = { type: SELECT_FILE, payload: file };
  dispatch(action);
};

export const returnFile = () => (dispatch) => {
  dispatch({ type: RETURN_FILE });
};
