import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import TodoListItem from './TodoListItem';
import { selectFilteredTodoIds, selectStatus } from './todosSlice';

// const selectTodoIds = (state) => state.todos.map((todo) => todo.id);

const TodoList = () => {
  // const todoIds = useSelector(selectTodoIds, shallowEqual);
  const todoIds = useSelector(selectFilteredTodoIds, shallowEqual);
  const loadingStatus = useSelector(selectStatus);

  if (loadingStatus === 'loading') {
    return (
      <div className="todo-list">
        <div className="loader" />
      </div>
    );
  }

  const renderedListItems = todoIds.map((todoId) => {
    return <TodoListItem key={todoId} id={todoId} />;
  });

  return <ul className="todo-list">{renderedListItems}</ul>;
};

export default TodoList;
