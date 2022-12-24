const initialState = {
  files: {},
  selectedFile: [],
  fileStack: [],
  pathStack:['/Disk'],
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
      if (!action.payload.children) {
        return state
      }

      const undoStack = state.fileStack;
      undoStack.push(action.payload);
      const newPathStack = state.pathStack;
      newPathStack.push(action.payload?.path)
      return {
        ...state,
        fileStack: undoStack,
        selectedFile: action.payload,
        pathStack:newPathStack
      };
    case 'REDO_FILE':
      if (state.fileStack.length < 2) {
        return state
      }
        
      
      const redoStack = state.fileStack;
      redoStack.pop();
      const decPathStack = state.pathStack;
      decPathStack.pop()
      return {
        ...state,
        selectedFile: redoStack[redoStack.length - 1],
        fileStack: redoStack,
        pathStack:decPathStack
      };

    default:
      return state;
  }
};

export default filesReducer;
