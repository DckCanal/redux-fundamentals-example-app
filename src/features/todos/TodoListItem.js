import React from 'react';

import { ReactComponent as TimesSolid } from './times-solid.svg';

import { availableColors, capitalize } from '../filters/colors';
import { useSelector, useDispatch } from 'react-redux';
import { selectTodoById } from './todosSlice';

// const selectTodoById = (state, todoId) => {
//   return state.todos.find((todo) => todo.id === todoId);
// };

const TodoListItem = ({ id }) => {
  const todo = useSelector(selectTodoById(id));
  const { text, completed, color } = todo;
  const dispatch = useDispatch();

  const handleCompletedChanged = (e) => {
    // onCompletedChange(e.target.checked);
    dispatch({ type: 'todos/todoToggled', payload: todo.id });
  };

  const handleColorChanged = (e) => {
    // onColorChange(e.target.value);
    dispatch({
      type: 'todos/colorSelected',
      payload: { color: e.target.value, todoId: todo.id },
    });
  };

  const onDelete = () => {
    dispatch({ type: 'todos/todoDeleted', payload: todo.id });
  };

  const colorOptions = availableColors.map((c) => (
    <option key={c} value={c}>
      {capitalize(c)}
    </option>
  ));

  return (
    <li>
      <div className="view">
        <div className="segment label">
          <input
            className="toggle"
            type="checkbox"
            checked={completed}
            onChange={handleCompletedChanged}
          />
          <div className="todo-text">{text}</div>
        </div>
        <div className="segment buttons">
          <select
            className="colorPicker"
            value={color}
            style={{ color }}
            onChange={handleColorChanged}
          >
            <option value=""></option>
            {colorOptions}
          </select>
          <button className="destroy" onClick={onDelete}>
            <TimesSolid />
          </button>
        </div>
      </div>
    </li>
  );
};

export default TodoListItem;
