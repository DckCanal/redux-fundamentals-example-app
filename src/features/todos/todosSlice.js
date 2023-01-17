import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../api/client';

const initialState = {
  entities: {},
  status: 'idle',
};

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await client.get('/fakeApi/todos');
  return response.todos;
});

export const saveNewTodo = createAsyncThunk(
  'todos/saveNewTodo',
  async (text) => {
    const response = await client.post('/fakeApi/todos', { todo: text });
    return response.todo;
  }
);

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    todoAdded(state, action) {
      const todo = action.payload;
      state.entities[todo.id] = todo;
    },
    todoToggled(state, action) {
      const todo = state.entities[action.payload];
      todo.completed = !todo.completed;
    },
    todoColorSelected: {
      reducer(state, action) {
        const { color, todoId } = action.payload;
        state.entities[todoId].color = color;
      },
      prepare(todoId, color) {
        return {
          payload: {
            todoId,
            color,
          },
        };
      },
    },
    todoDeleted(state, action) {
      delete state.entities[action.payload];
    },
    allCompleted(state, action) {
      Object.values(state.entities).forEach((todo) => (todo.completed = true));
    },
    completedCleared(state, action) {
      state.entities = state.entities.filter((todo) => !todo.completed);
    },
    todosLoaded(state, action) {
      state.entities = action.payload;
      state.status = 'idle';
    },
    todosLoading(state, action) {
      state.status = 'loading';
    },
    extraReducer: (builder) => {
      builder
        .addCase(fetchTodos.pending, (state, action) => {
          state.status = 'loading';
        })
        .addCase(fetchTodos.fulfilled, (state, action) => {
          const newEntities = {};
          action.payload.forEach((todo) => {
            newEntities[todo.id] = todo;
          });
          state.entities = newEntities;
          state.status = 'idle';
        })
        .addCase(saveNewTodo.fulfilled, (state, action) => {
          state.entities[action.payload.id] = action.payload;
        });
    },
  },
});

export const { todoAdded, todoToggled, todosLoading } = todosSlice.actions;
export default todosSlice.reducer;
