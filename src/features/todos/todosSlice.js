import { client } from '../../api/client';

// const initialState = [
//   { id: 0, text: 'Learn React', completed: true },
//   { id: 1, text: 'Learn Redux', completed: false, color: 'purple' },
//   { id: 2, text: 'Build something fun!', completed: false, color: 'blue' },
// ];
const initialState = [];

function nextTodoId(todos) {
  const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1);
  return maxId + 1;
}

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    case 'todos/todoAdded': {
      return [
        ...state,
        // {
        //   id: nextTodoId(state),
        //   text: action.payload,
        //   completed: false,
        // },
        action.payload,
      ];
    }
    case 'todos/todoToggled': {
      return state.map((todo) =>
        todo.id == action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      );
    }

    case 'todos/colorSelected': {
      return state.map((todo) => {
        if (todo.id == action.payload.todoId) {
          return { ...todo, color: action.payload.color };
        } else {
          return todo;
        }
      });
    }
    case 'todos/todoDeleted': {
      return state.filter((todo) => todo.id != action.payload);
    }
    case 'todos/allCompleted': {
      return state.map((todo) => ({ ...todo, completed: true }));
    }
    case 'todos/completedCleared': {
      return state.filter((todo) => !todo.completed);
    }
    case 'todos/todosLoaded': {
      return action.payload;
    }
    default:
      return state;
  }
}

export const todosLoaded = (todos) => ({
  type: 'todos/todosLoaded',
  payload: todos,
});

export const todoAdded = (todo) => ({
  type: 'todos/todoAdded',
  payload: todo,
});

export function fetchTodos() {
  return async function (dispatch, getState) {
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
