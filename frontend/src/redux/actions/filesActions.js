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
    try {
      const formData = new FormData();
      const currentFile = store.getState().folderReducer.selectedFile;
      for (let i = 0; i < files.length; i++) {
        let relativePath = files[i].webkitRelativePath;
        if (!relativePath) {
          relativePath = `${currentFile.path}/${files[i].name}`;
        }
        formData.append('files', files[i]);
        formData.append('relativePath', relativePath);
      }
      const response = await fileService.addFiles(formData);
      if (response.status === 200) {
        return dispatch(fetchFiles(currentFile));
      }
    } catch (error) {
      console.log(error);
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
  dispatch({ typy: RETURN_FILE });
};
