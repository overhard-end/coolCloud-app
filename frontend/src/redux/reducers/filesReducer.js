import { SET_FILES, SELECT_FILE, RETURN_FILE } from '../actions/types';

const initialState = {
  files: {},
  selectedFile: {},
  fileStack: [],
  size: 0,
  maxSize: 0,
  isLoading: true,
  uploadFile: {
    files: [],
    currentFile: {},
    chunks: null,
    currentChunk: null,
    uploadedFiles: [],
  },
};

const filesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FILES:
      return {
        ...state,
        files: action.payload,
        selectedFile: action.payload,
        size: action.payload.size,
        maxSize: action.payload.maxSize,
        fileStack: [action.payload],
        isLoading: false,
      };

    case SELECT_FILE:
      if (!action.payload.children) {
        return state;
      }
      return {
        ...state,
        fileStack: [...state.fileStack, action.payload],
        selectedFile: action.payload,
      };
    case RETURN_FILE:
      if (state.fileStack.length < 2) {
        return state;
      }
      const fileStackPop = state.fileStack;
      fileStackPop.pop();
      return {
        ...state,
        fileStack: fileStackPop,
        selectedFile: state.fileStack.at(-1),
      };
    case 'UPLOAD_START':
      return {
        ...state,
        uploadFile: {
          ...state.uploadFile,
          files: [...action.payload],
        },
      };
    case 'UPLOAD_CHANGE':
      return {
        ...state,
        uploadFile: {
          ...state.uploadFile,
          files: [...action.payload],
        },
      };
    case 'UPLOAD_PROGRESS':
      let file;
      if (action.payload.totalChunks === action.payload.currentChunkIndex) {
        file = action.payload.file;
      }
      return {
        ...state,
        uploadFile: {
          ...state.uploadFile,
          currentFile: action.payload.file,
          chunks: action.payload.totalChunks,
          currentChunk: action.payload.currentChunkIndex,
          uploadedFiles: file
            ? [...state.uploadFile.uploadedFiles, file.name]
            : state.uploadFile.uploadedFiles,
        },
      };
    case 'UPLOAD_DONE':
      return {
        ...state,
        uploadFile: {
          files: [],
          currentFile: {},
          chunks: 0,
          currentChunk: 0,
          uploadedFiles: [],
        },
      };

    default:
      return state;
  }
};

export default filesReducer;
