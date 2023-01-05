export const print1 = (storeAPI) => (next) => (action) => {
  console.log('1');
  return next(action);
};

export const print2 = (storeAPI) => (next) => (action) => {
  console.log('2');
  return next(action);
};

export const print3 = (storeAPI) => (next) => (action) => {
  console.log('3');
  return next(action);
};

export function loggerMiddleware(storeAPI) {
  return function wrapDispatch(next) {
    return function handleAction(action) {
      //Before executing reducer...
      console.log('Dispatching', action);

      //Entering middlewares' pipeline...
      let result = next(action);

      //After reducer execution...
      console.log('next state', storeAPI.getState());
      return result;
    };
  };
}

export const delayedMessageMiddleware = (storeAPI) => (next) => (action) => {
  if (action.type === 'todos/todoAdded') {
    setTimeout(() => {
      console.log('Added a new todo 1 sec ago: ', action.payload);
    }, 1000);
  }
  return next(action);
};
