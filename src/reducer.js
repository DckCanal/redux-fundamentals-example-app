export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case 'todos/todoAdded': {
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: nextTodoId(state.todos),
            text: action.payload,
            completed: false,
          },
        ],
      };
    }
    case 'todos/todoToggled': {
      return {
        ...state,
        todos: state.todos.map((todo) => {
          if (todo.id !== action.payload) return todo;
          return {
            ...todo,
            completed: !todo.completed,
          };
        }),
      };
    }
    case 'filters/statusFilterChanged': {
      return {
        ...state,
        filters: {
          ...state.filters,
          status: action.payload,
        },
      };
    }
    default:
      return state;
  }
}
