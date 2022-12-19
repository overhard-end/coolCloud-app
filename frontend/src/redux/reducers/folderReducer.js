const initialState = {
  files: [],
  selectedFile: [],
  previousFilesStack: [],
  totalSize: 0,
};
const folderReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_FILES':
      return {
        ...state,
        files: action.payload,
        selectedFile: action.payload,
        previousFilesStack: [action.payload],
        totalSize: action.payload.size,
      };
    case 'SELECT_FILE':
      const newStack = state.previousFilesStack;
      newStack.push(action.payload);

      return {
        ...state,
        previousFilesStack: newStack,
        selectedFile: action.payload,
      };
    case 'RETURN_FILE':
      if (state.previousFilesStack.length > 1) {
        const stack = state.previousFilesStack;
        stack.pop();
        return {
          ...state,
          selectedFile: stack[stack.length - 1],
          previousFilesStack: stack,
        };
      }

    default:
      return state;
  }
};

export default folderReducer;
