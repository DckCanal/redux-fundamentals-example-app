import { combineReducers } from 'redux';

import todosReducer from './features/todos/todosSlice';
import filtersReducer from './features/filters/filtersSlice';

// export default function appReducer(state = {}, action) {
//   return {
//     todos: todosReducer(state.todos, action),
//     filters: filtersReducer(state.filters, action),
//   };
// }

/*
  combineReducers accepts an object where the key names will
  become the keys in your root state object, and the values are
  the slice reducer functions that know how to update those
  slices of the Redux state.

  Remember, the key names you give to combineReducers decides
  what the key names of your state object will be!
*/

const rootReducer = combineReducers({
  todos: todosReducer,
  filters: filtersReducer,
});

export default rootReducer;
