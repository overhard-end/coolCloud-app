import axios from 'axios';

export async function fetchFiles(dispatch) {
  try {
    console.log(process.env.SERVER_URL);
    const response = await axios.get('http://localhost:4000/api/files');
    if (response.status === 200) {
      const files = response.data;
      dispatch({
        type: 'SET_FILES',
        payload: files,
      });
    }
  } catch (e) {
    console.log(e);
  }
}
export function removeFile(file) {
  try {
    const response = axios.post(`http://localhost:4000/api/removeFile`, {
      file: {
        path: file.path,
        type: file.type,
      },
    });
    if (response.status === 200) {
      const removeStatus = response.body.statusSuccesse;
      const message = response.body.message;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function addFile(dispatch, file) {
  try {
    const formData = new FormData();

    for (let i = 0; i < file.length; i++) {
      const filePath = file[i].webkitRelativePath;
      formData.append('file', file[i]);
      formData.append('pathArray', filePath);
    }
    await axios.post(`http://localhost:4000/api/files`, formData, {});
    fetchFiles(dispatch);
  } catch (e) {
    console.log(e);
  }
}
export function selectFile(file, dispatch) {
  if (file) {
    dispatch({
      type: 'SELECT_FILE',
      payload: file,
    });
  }
}
export function returnFile(dispatch) {
  dispatch({
    type: 'RETURN_FILE',
    payload: null,
  });
}
