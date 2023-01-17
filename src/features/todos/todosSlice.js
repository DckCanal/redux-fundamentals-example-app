import {
  createSlice,
  createSelector,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import { client } from '../../api/client';
import { StatusFilters } from '../filters/filtersSlice';

const todosAdapter = createEntityAdapter();

const initialState = todosAdapter.getInitialState({
  status: 'idle',
});

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
    // todoAdded(state, action) {
    //   const todo = action.payload;
    //   state.entities[todo.id] = todo;
    // },
    //todoAdded: todosAdapter.addOne,
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
    // todoDeleted(state, action) {
    //   delete state.entities[action.payload];
    // },
    todoDeleted: todosAdapter.removeOne,
    allCompleted(state, action) {
      Object.values(state.entities).forEach((todo) => (todo.completed = true));
    },
    completedCleared(state, action) {
      //state.entities = state.entities.filter((todo) => !todo.completed);
      const completedIds = Object.values(state.entities)
        .filter((todo) => todo.completed)
        .map((todo) => todo.id);
      todosAdapter.removeMany(state, completedIds);
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
          // const newEntities = {};
          // action.payload.forEach((todo) => {
          //   newEntities[todo.id] = todo;
          // });
          // state.entities = newEntities;
          todosAdapter.setAll(state, action.payload);
          state.status = 'idle';
        })
        .addcase(saveNewTodo.fulfilled, todosAdapter.addOne);
      // .addCase(saveNewTodo.fulfilled, (state, action) => {
      //   state.entities[action.payload.id] = action.payload;
      // });
    },
  },
});

export const {
  todoToggled,
  todoColorSelected,
  todoDeleted,
  completedCleared,
  allCompleted,
} = todosSlice.actions;

export default todosSlice.reducer;

export const { selectAll: selectTodos, selectById: selectTodoById } =
  todosAdapter.getSelectors((state) => state.todos);

export const selectTodoIds = createSelector(selectTodos, (todos) =>
  todos.map((todo) => todo.id)
);

export const selectFilteredTodos = createSelector(
  selectTodos,
  (state) => state.filters,
  (todos, filters) => {
    const { status, colors } = filters;
    const showAllCompletions = status === StatusFilters.All;
    if (showAllCompletions && colors.length === 0) return todos;

    const completedStatus = status === StatusFilters.Completed;
    return todos.filter((todo) => {
      const statusMatches =
        showAllCompletions || todo.completed === completedStatus;
      const colorMatches = colors.length === 0 || colors.includes(todo.color);
      return statusMatches && colorMatches;
    });
  }
);

export const selectFilteredTodoIds = createSelector(
  selectFilteredTodos,
  (filteredTodos) => filteredTodos.map((todo) => todo.id)
);
