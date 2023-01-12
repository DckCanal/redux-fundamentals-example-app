import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import store from './store';
import { Provider } from 'react-redux';

import './api/server';

// console.log('Initial state: ', store.getState());
// const unsubscribe = store.subscribe(() =>
//   console.log('Store after dispatch: ', store.getState())
// );

// store.dispatch({ type: 'todos/todoAdded', payload: 'Learn about actions' });
// store.dispatch({ type: 'todos/todoAdded', payload: 'Learn about reducers' });
// store.dispatch({ type: 'todos/todoAdded', payload: 'Learn about stores' });

// store.dispatch({ type: 'todos/todoToggled', payload: 0 });
// store.dispatch({ type: 'todos/todoToggled', payload: 1 });
// store.dispatch({
//   type: 'todos/colorSelected',
//   payload: { todoId: 2, color: 'red' },
// });

// store.dispatch({ type: 'filters/statusFilterChanged', payload: 'Active' });

// store.dispatch({
//   type: 'filters/colorFilterChanged',
//   payload: { color: 'red', changeType: 'added' },
// });
// store.dispatch({
//   type: 'filters/colorFilterChanged',
//   payload: { color: 'purple', changeType: 'added' },
// });
// store.dispatch({
//   type: 'filters/colorFilterChanged',
//   payload: { color: 'red', changeType: 'removed' },
// });
// store.dispatch({
//   type: 'filters/colorFilterChanged',
//   payload: { color: 'green', changeType: 'removed' },
// });

// unsubscribe();

// store.dispatch({ type: 'todos/todoAdded', payload: 'Try creating a store' });

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
