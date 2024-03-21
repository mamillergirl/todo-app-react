import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TodoItem = ({ todo, onDelete, onToggleDone, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTodo, setUpdatedTodo] = useState(todo);

  const handleEdit = () => {
    setIsEditing(!isEditing);
    setUpdatedTodo(todo);
  };

  const handleSave = () => {
    setIsEditing(false);
    onUpdate(updatedTodo);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTodo({
      ...updatedTodo,
      [name]: value
    });
  };

  const handleDateChange = (date) => {
    setUpdatedTodo({
      ...updatedTodo,
      deadline: date
    });
  };

  return (
    <div className={`border rounded p-3 my-2 flex items-center justify-between ${todo.done ? 'bg-gray-200' : ''}`}>
      {!isEditing ? (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={todo.done}
            onChange={() => onToggleDone(todo.id)}
            className="mr-3 form-checkbox h-5 w-5 text-green-500"
          />
          <div>
            <h3 className={todo.done ? ' text-gray-500' : ''}>{todo.name}</h3>
            <p className={todo.done ? ' text-gray-500' : ''}>{todo.description}</p>
            <p className={todo.done ? ' text-gray-500' : ''}>Due: {todo.deadline.toLocaleDateString()}</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center w-full">
          <input
            type="checkbox"
            checked={updatedTodo.done}
            onChange={() =>
              setUpdatedTodo({ ...updatedTodo, done: !updatedTodo.done })
            }
            className="mr-3 form-checkbox h-5 w-5 text-green-500"
          />
          <div className="flex w-full flex-col">
            <input
              type="text"
              name="name"
              value={updatedTodo.name}
              onChange={handleInputChange}
              className="mr-3  px-2 py-1 border rounded"
            />
            <input
              type="text"
              name="description"
              value={updatedTodo.description}
              onChange={handleInputChange}
              className="mr-3 px-2 py-1 border rounded"
            />
            <DatePicker
              selected={updatedTodo.deadline}
              onChange={handleDateChange}
              dateFormat="MM/dd/yyyy"
              className="mr-3 px-2 py-1 border rounded"
            />
          </div>
        </div>
      )}
      <div>
        <button onClick={handleEdit} className="mr-2 text-blue-600">
          {isEditing ? "Cancel" : "Edit"}
        </button>
        <button onClick={() => onDelete(todo.id)} className="text-red-600">
          <FontAwesomeIcon icon={faTrashAlt} />
        </button>
        {isEditing && (
          <button onClick={handleSave} className="ml-2 text-green-600">
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default TodoItem;
