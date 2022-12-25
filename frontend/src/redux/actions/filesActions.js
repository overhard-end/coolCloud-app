import axios from 'axios';
import store from '../store';

export function fetchFiles(currentFile) {
  return async (dispatch) => {
    try {
      const response = await axios.get('http://localhost:4000/api/files');
      return dispatch({ type: 'SET_FILES', payload: response.data, currentFile: currentFile });
    } catch (error) {
      console.log(error);
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
      const response = await axios.post('http://localhost:4000/api/files', formData);
      if (response.status === 200) {
        return dispatch(fetchFiles(currentFile));
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export async function removeFile(file) {
  try {
    const response = axios.post(`http://localhost:4000/api/removeFile`, {
      file: {
        path: file.path,
        type: file.type,
      },
    });
    if (response.status === 200) {
    }
  } catch (error) {
    console.log(error);
  }
}

export function selectFile(file) {
  if (file) {
    return {
      type: 'SELECT_FILE',
      payload: file,
    };
  }
}
export function returnFile() {
  return {
    type: 'RETURN_FILE',
  };
}
