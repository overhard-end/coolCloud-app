const initialState = {
  files: [],
  selectedFile: {},
  fileStack: [],
  totalSize: 0,
};
const filesReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_FILES':
      return {
        ...state,
        files: action.payload,
        selectedFile: action.payload,
        fileStack: [action.payload],
        totalSize: action.payload.size,
      };
    case 'UNDO_FILE':
      if (!action.payload.children && !action.payload.children.length > 0) {
        return {
          ...state,
        };
      }
      const undoStack = state.fileStack;
      undoStack.push(action.payload);
      return {
        ...state,
        fileStack: undoStack,
        selectedFile: action.payload,
      };
    case 'REDO_FILE':
      if (state.fileStack.length < 2) {
        return {
          ...state,
        };
      }
      const redoStack = state.fileStack;
      redoStack.pop();
      return {
        ...state,
        selectedFile: redoStack[redoStack.length - 1],
        fileStack: redoStack,
      };

    default:
      return state;
  }
};

export default filesReducer;
