import axios from 'axios';
import store from '../store';
export function fetchFiles() {
  return async function (dispatch) {
    const response = await axios.get('http://localhost:4000/api/files');
    return dispatch({ type: 'SET_FILES', payload: response.data });
  };
}

export async function addFile(file) {
  try {
    const formData = new FormData();

    for (let i = 0; i < file.length; i++) {
      const filePath = file[i].webkitRelativePath;
      formData.append('file', file[i]);
      formData.append('pathArray', filePath);
    }
    await axios.post(`http://localhost:4000/api/files`, formData, {});
  } catch (e) {
    console.log(e);
  }
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

export function undoFile(file) {
  if (file) {
    return {
      type: 'UNDO_FILE',
      payload: file,
    };
  }
}
export function redoFile() {
  return {
    type: 'REDO_FILE',
  };
}
