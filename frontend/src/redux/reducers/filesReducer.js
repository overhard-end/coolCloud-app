const SELECT_FILE = 'SELECT_FILE';
const SET_FILES = 'SET_FILES';
const RETURN_FILE = 'RETURN_FILE';
const UPLOAD_FILE = 'UPLOAD_FILE';

const initialState = {
  files: {},
  selectedFile: {},
  fileStack: [],
  totalSize: 0,
  isLoading: true,
};

const filesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FILES:
      return {
        ...state,
        files: action.payload,
        selectedFile: action.payload,
        totalSize: action.payload.size,
        fileStack: [action.payload],
        isLoading: false,
      };

    case UPLOAD_FILE:
      return {
        ...state,
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

    default:
      return state;
  }
};

export default filesReducer;
