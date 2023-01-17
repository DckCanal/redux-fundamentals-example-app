import { configureStore } from '@reduxjs/toolkit';

import todosReducer from './features/todos/todosSlice';
import filtersReducer from './features/filters/filtersSlice';

const store = configureStore({
  reducer: {
    todos: todosReducer,
    filters: filtersReducer,
  },
});

export default store;

// import { createStore, applyMiddleware } from 'redux';
// import thunkMiddleware from 'redux-thunk';
// import rootReducer from './reducer';
// import {
//   print1,
//   print2,
//   print3,
//   loggerMiddleware,
//   delayedMessageMiddleware,
// } from './exampleAddons/middleware';
// import { composeWithDevTools } from 'redux-devtools-extension';
// import {
//   sayHiOnDispatch,
//   includeMeaningOfLife,
// } from './exampleAddons/enhancers';

// let preloadedState;
// const persistedTodosString = localStorage.getItem('todos');

// if (persistedTodosString) {
//   preloadedState = {
//     todos: JSON.parse(persistedTodosString),
//   };
// }

// const composedEnhancer = compose(sayHiOnDispatch, includeMeaningOfLife);

// const store = createStore(rootReducer, preloadedState, composedEnhancer);

// const middlewareEnhancer = applyMiddleware(
//   loggerMiddleware,
//   delayedMessageMiddleware,
//   print1,
//   print2,
//   print3
// );
// const store = createStore(rootReducer, middlewareEnhancer);

// const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware));
// const store = createStore(rootReducer, composedEnhancer);
// export default store;
