import fileService from '../../services/fileService';
import { SET_FILES, SELECT_FILE, RETURN_FILE } from '../actions/types';
import store from '../store';
import { Http } from '../../api/api';
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
    dispatch({ type: 'UPLOAD_START', payload: files });
    const reader = new FileReader();

    const chunkSize = 10 * 1024; // 10kb
    const selectedFile = store.getState().filesReducer.selectedFile;

    let currentFileIndex = null;
    let currentChunkIndex = null;

    try {
      function readAndUploadFile() {
        const filesForUploading = store.getState().filesReducer.uploadFile.files;
        const file = filesForUploading[currentFileIndex];
        if (!file) {
          dispatch({ type: 'UPLOAD_DONE' });
          return dispatch(fetchFiles());
        }
        const chunkStart = currentChunkIndex * chunkSize;
        const slicedBlob = file.slice(chunkStart, chunkStart + chunkSize);

        reader.readAsDataURL(slicedBlob);

        reader.onload = (e) => uploadCurrentChunk(e.target.result, file);
      }

      async function uploadCurrentChunk(chunk, file) {
        const currentDir = selectedFile.path ? selectedFile.path : '';
        let relatedFilePath = file?.webkitRelativePath.split('/');
        if (relatedFilePath) {
          relatedFilePath.pop();
          relatedFilePath.join('/');
        }

        const relativePath = currentDir + relatedFilePath;

        const totalChunks = Math.ceil(file.size / chunkSize) - 1;
        const params = new URLSearchParams();

        params.set('fileName', file.name);
        params.set('relativePath', relativePath);
        params.set('totalChunks', totalChunks);
        params.set('currentChunkIndex', currentChunkIndex);
        const headers = { 'content-type': 'application/octet-stream' };

        await new Http({ withAuth: true })
          .post('files?' + params, chunk, { headers })
          .then((res) => {
            dispatch({
              type: 'UPLOAD_PROGRESS',
              payload: {
                file,
                totalChunks,
                currentChunkIndex,
              },
            });
            if (totalChunks === currentChunkIndex) {
              currentChunkIndex = 0;
              currentFileIndex++;

              return readAndUploadFile();
            }
            currentChunkIndex++;
            readAndUploadFile();
          });
      }
      if (currentFileIndex === null && currentChunkIndex === null) {
        currentFileIndex = 0;
        currentChunkIndex = 0;
        readAndUploadFile();
      }
    } catch (error) {
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
