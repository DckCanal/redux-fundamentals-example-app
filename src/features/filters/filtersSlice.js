const initialState = {
  status: 'All',
  colors: [],
};

export default function filtersReducer(state = initialState, action) {
  switch (action.type) {
    case 'filters/statusFilterChanged': {
      return {
        ...state,
        status: action.payload,
      };
    }
    case 'filters/colorFilterChanged': {
      if (action.payload.changeType === 'added') {
        if (!state.colors.includes(action.payload.color))
          return {
            ...state,
            //colors: state.colors.slice().push(action.payload.color),
            colors: [...state.colors, action.payload.color],
          };
        else return state;
      } else if (action.payload.changeType === 'removed') {
        return {
          ...state,
          colors: state.colors.filter(
            (color) => color !== action.payload.color
          ),
        };
      } else {
        return state;
      }
    }
    default:
      return state;
  }
}
