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
    const originalFileList = [...files];
    const chekingFileName = originalFileList[0].name;
    const checkFileExists = await new Http({ withAuth: true }).post('/filesCheck', {
      fileName: chekingFileName,
    });
    if (checkFileExists.status === 409) return dispatch({ type: 'UPLOAD_DONE' });

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
    const worker = new Worker(new URL('../../longProcesses/hashFile.js', import.meta.url));
    worker.postMessage(originalFileList[0]);

    worker.onmessage = (e) => {
      console.log(e.data);
    };
    return;
    dispatch({ type: 'UPLOAD_START', payload: filesArray });

    const reader = new FileReader();

    const chunkSize = 10 * 1024; // 10kb
    const selectedFile = store.getState().filesReducer.selectedFile;

    let currentFileIndex = null;
    let currentChunkIndex = null;

    try {
      function readAndUploadCurrentFile() {
        const filesPresentation = store.getState().filesReducer.uploadFile.files;

        const fileListForUploading = originalFileList.filter((originalFile) =>
          filesPresentation.some((file) => originalFile.name === file.name),
        );
        const file = fileListForUploading[currentFileIndex];

        if (!file) {
          dispatch({ type: 'UPLOAD_DONE' });
          return dispatch(fetchFiles());
        }

        const chunkStartPoint = currentChunkIndex * chunkSize;
        const slicedBlob = file.slice(chunkStartPoint, chunkStartPoint + chunkSize);

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
                totalChunks,
                currentChunkIndex,
                currentUploadingFile: { name: file.name, size: file.size },
              },
            });

            if (totalChunks === currentChunkIndex) {
              currentChunkIndex = 0;
              currentFileIndex++;
              return readAndUploadCurrentFile();
            }

            currentChunkIndex++;
            readAndUploadCurrentFile();
          });
      }
      if (currentFileIndex === null && currentChunkIndex === null) {
        currentFileIndex = 0;
        currentChunkIndex = 0;
        readAndUploadCurrentFile();
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
