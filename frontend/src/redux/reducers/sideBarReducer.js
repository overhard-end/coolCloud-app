const initialState = {
  selectedItem: '',
};
const sideBarReducer = (state = initialState, action) => {
  return { ...state, selectedItem: action.payload };
};

export default sideBarReducer;
