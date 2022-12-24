
import axios from 'axios';
import store from '../store';
const folderState = store.getState().folderReducer
export function fetchFiles() {
  return async (dispatch) => {
    try {
      const response = await axios.get('http://localhost:4000/api/files');
      return dispatch({ type: 'SET_FILES', payload: response.data });

    } catch (error) {
      console.log(error)
    }
    
  };
}

export  function addFile(files) {
  return async (dispatch)=>{
    const formData = new FormData()
      console.log(folderState)
      for(let i = 0; i < files.length; i++){
        let relativePath = files[i].webkitRelativePath
        if(!relativePath){
          relativePath =  `/${files[i].name}`
        }
        formData.append('files',files[i])
        formData.append('relativePath',relativePath)
        
      }
      const response = await axios.post('http://localhost:4000/api/files',formData)
      if(response.status === 200) {
        return dispatch(fetchFiles())
      }
     
      
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
