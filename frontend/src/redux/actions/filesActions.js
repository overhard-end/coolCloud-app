import { FileDto } from "../../DTO's/fileDto";
import fileService from '../../services/fileService';
import {
  SET_FILES,
  SELECT_FILE,
  RETURN_FILE,
  SET_UPLOAD,
  FILE_UPLOADED,
  UPLOAD_ERROR,
  UPLOAD_DONE,
  SET_CURRENT_FILE,
} from '../actions/types';
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
      dispatch({ type: SET_UPLOAD, payload: dtoFileList });
      console.log(dtoFileList);
      let currentFileIndex = null;

      async function readAndUploadFile() {
        const selectedFile = store.getState().filesReducer.selectedFile;
        const filesFromStore = store.getState().uploadReducer.files;

        const fileListForUploading = originalFileList.filter((originalFile) =>
          filesFromStore.some((file) => originalFile.name === file.name),
        );
        const file = fileListForUploading[currentFileIndex];
        const fileForStore = filesFromStore[currentFileIndex];
        if (!file) {
          dispatch({ type: UPLOAD_DONE });
          return dispatch(fetchFiles());
        }
        dispatch({ type: SET_CURRENT_FILE, payload: fileForStore });
        const fileName = file.name;
        let webkitRelativePath = file.webkitRelativePath.split('/');
        webkitRelativePath.pop();
        webkitRelativePath.join('/');
        const relativePath = webkitRelativePath.join('/');
        const currentPath = selectedFile?.path;
        const chunkList = fileService.createFileChunk(file);
        const fileHash = await fileService.ganerateHash(chunkList);
        return;
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
              .then(() => {
                currentFileIndex++;

                dispatch({ type: FILE_UPLOADED, payload: fileForStore });
                readAndUploadFile();
              })
              .catch((error) => console.log(error));
          })
          .catch(dispatch({ type: UPLOAD_ERROR, payload: fileForStore }));
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
