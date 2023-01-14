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
  entities: [],
};

// function nextTodoId(todos) {
//   const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1);
//   return maxId + 1;
// }

// REDUCER
export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    case 'todos/todoAdded': {
      return {
        ...state,
        entities: [...state.entities, action.payload],
      };
    }
    case 'todos/todoToggled': {
      return {
        ...state,
        entities: state.entities.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };
    }

    case 'todos/colorSelected': {
      return {
        ...state,
        entities: state.entities.map((todo) => {
          if (todo.id === action.payload.todoId) {
            return { ...todo, color: action.payload.color };
          } else {
            return todo;
          }
        }),
      };
    }
    case 'todos/todoDeleted': {
      return {
        ...state,
        entities: state.entities.filter((todo) => todo.id !== action.payload),
      };
    }
    case 'todos/allCompleted': {
      return {
        ...state,
        entities: state.entities.map((todo) => ({ ...todo, completed: true })),
      };
    }
    case 'todos/completedCleared': {
      return {
        ...state,
        entities: state.entities.filter((todo) => !todo.completed),
      };
    }
    case 'todos/todosLoaded': {
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
  return async function (dispatch, getState) {
    dispatch(todosLoading());
    const response = await client.get('/fakeApi/todos');
    dispatch(todosLoaded(response.todos));
  };
}

export function saveNewTodo(text) {
  return async function saveNewTodoThunk(dispatch, getState) {
    const initialTodo = { text };
    const response = await client.post('/fakeApi/todos', { todo: initialTodo });
    dispatch(todoAdded(response.todo));
  };
}
// SELECTORS
export const selectStatus = (state) => state.todos.status;
export const selectTodos = (state) => state.todos.entities;
export const selectTodoById = (todoId) => (state) =>
  selectTodos(state).find((todo) => todo.id === todoId);

// MEMOIZED SELECTORS
export const selectTodoIds = createSelector(
  (state) => state.todos,
  (todos) => todos.map((todo) => todo.id)
);

export const selectFilteredTodos = createSelector(
  (state) => state.todos,
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
