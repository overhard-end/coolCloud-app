import { FileDto } from "../../DTO's/fileDto";
import fileService from '../../services/fileService';
import { SET_FILES, SELECT_FILE, RETURN_FILE } from '../actions/types';
import store from '../store';

export function fetchFiles() {
  return async (dispatch) => {
    try {
      const response = await fileService.getFiles();
      return dispatch({ type: SET_FILES, payload: response.data });
    } catch (error) {
      console.log(error);
    }
  };
}

export function uploadFile(files) {
  return async (dispatch) => {
    try {
      const originalFileList = [...files];
      const dtoFileList = originalFileList.map((file) => new FileDto(file));
      dispatch({ type: 'UPLOAD_START', payload: dtoFileList });
      let currentFileIndex = null;
      async function readAndUploadFile() {
        const selectedFile = store.getState().filesReducer.selectedFile;
        const filesFromStore = store.getState().filesReducer.uploadFile.files;

        const fileListForUploading = originalFileList.filter((originalFile) =>
          filesFromStore.some((file) => originalFile.name === file.name),
        );
        const file = fileListForUploading[currentFileIndex];
        if (!file) {
          dispatch({ type: 'UPLOAD_DONE' });
          return dispatch(fetchFiles());
        }
        const fileName = file.name;
        const relativePath = file.webkitRelativePath;
        const currentPath = selectedFile?.path;
        const chunkList = fileService.createFileChunk(file);
        const fileHash = await fileService.ganerateHash(chunkList);

        const formData = new FormData();

        let dataForMerge = { fileHash, fileName, relativePath: currentPath + '/' + relativePath };
        await Promise.all(
          chunkList.map((chunk, index) => {
            formData.append(fileHash + '-' + index, chunk);
            return fileService.sendChunk(formData);
          }),
        )
          .then(async () => {
            await fileService
              .mergeChunks(dataForMerge)
              .then((res) => {
                dispatch({ type: 'UPLOAD_PROGRESS' });
              })
              .catch((error) => console.log(error));
          })
          .catch(dispatch({ type: 'UPLOAD_DONE' }));
      }

      if (currentFileIndex === null) {
        currentFileIndex = 0;
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
