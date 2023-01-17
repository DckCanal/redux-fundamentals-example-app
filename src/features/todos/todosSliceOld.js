import { client } from '../../api/client';
import { createSelector } from 'reselect';
import { StatusFilters } from '../filters/filtersSlice';

// const initialState = [
//   { id: 0, text: 'Learn React', completed: true },
//   { id: 1, text: 'Learn Redux', completed: false, color: 'purple' },
//   { id: 2, text: 'Build something fun!', completed: false, color: 'blue' },
// ];
const initialState = {
  status: 'idle',
  entities: {},
};

// function nextTodoId(todos) {
//   const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1);
//   return maxId + 1;
// }

// REDUCER
export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    case 'todos/todoAdded': {
      const todo = action.payload;
      return {
        ...state,
        entities: {
          ...state.entities,
          [todo.id]: todo,
        },
      };
    }
    case 'todos/todoToggled': {
      const todoId = action.payload;
      const todo = state.entities[todoId];
      return {
        ...state,
        entities: {
          ...state.entities,
          [todoId]: {
            ...todo,
            completed: !todo.completed,
          },
        },
      };
    }

    case 'todos/colorSelected': {
      const todoId = action.payload.todoId;
      const todo = state.entities[todoId];
      const color = action.payload.color;
      return {
        ...state,
        entities: {
          ...state.entities,
          [todoId]: {
            ...todo,
            color,
          },
        },
      };
    }
    case 'todos/todoDeleted': {
      const todoId = action.payload;
      const newEntities = { ...state.entities };
      delete newEntities[todoId];
      return {
        ...state,
        entities: newEntities,
      };
    }
    case 'todos/allCompleted': {
      const newEntities = { ...state.entities };
      Object.values(newEntities).forEach((todo) => {
        newEntities[todo.id] = {
          ...todo,
          completed: true,
        };
      });
      return {
        ...state,
        entities: newEntities,
      };
    }
    case 'todos/completedCleared': {
      const newEntities = { ...state.entities };
      Object.values(newEntities).forEach((todo) => {
        if (todo.completed) delete newEntities[todo.id];
      });
      return {
        ...state,
        entities: newEntities,
      };
    }
    case 'todos/todosLoaded': {
      const newEntities = {};
      action.payload.forEach((todo) => {
        newEntities[todo.id] = todo;
      });
      return {
        ...state,
        status: 'idle',
        entities: action.payload,
      };
    }
    case 'todos/todosLoading': {
      return {
        ...state,
        status: 'loading',
      };
    }
    default:
      return state;
  }
}

// ACTION CREATORS
export const todosLoading = () => ({
  type: 'todos/todosLoading',
});

export const todosLoaded = (todos) => ({
  type: 'todos/todosLoaded',
  payload: todos,
});

export const todoAdded = (todo) => ({
  type: 'todos/todoAdded',
  payload: todo,
});

// THUNK CREATORS
export function fetchTodos() {
  return async function (dispatch, _getState) {
    dispatch(todosLoading());
    const response = await client.get('/fakeApi/todos');
    dispatch(todosLoaded(response.todos));
  };
}

export function saveNewTodo(text) {
  return async function saveNewTodoThunk(dispatch, _getState) {
    const initialTodo = { text };
    const response = await client.post('/fakeApi/todos', { todo: initialTodo });
    dispatch(todoAdded(response.todo));
  };
}
// SELECTORS
export const selectTodoEntities = (state) => state.todos.entities;
export const selectStatus = (state) => state.todos.status;
export const selectTodos = createSelector(selectTodoEntities, (entities) =>
  Object.values(entities)
);
export const selectTodoById = (todoId) => (state) =>
  selectTodoEntities(state)[todoId];

// MEMOIZED SELECTORS
export const selectTodoIds = createSelector(selectTodos, (todos) =>
  todos.map((todo) => todo.id)
);

export const selectFilteredTodos = createSelector(
  selectTodos,
  (state) => state.filters,
  (todos, filters) => {
    const { colors, status } = filters;
    if (status === StatusFilters.All && colors.length === 0) return todos;
    const completedStatus = status === StatusFilters.Completed;
    return todos.filter((todo) => {
      const statusMatches =
        todo.completed === completedStatus || status === StatusFilters.All;
      const colorMatches = colors.includes(todo.color) || colors.length === 0;
      return statusMatches && colorMatches;
    });
  }
);

export const selectFilteredTodoIds = createSelector(
  selectFilteredTodos,
  (filteredTodos) => filteredTodos.map((todo) => todo.id)
);

export const selectTotalCompletedTodos = (state) => {
  return selectTodos(state).filter((todo) => !todo.completed).length;
};
