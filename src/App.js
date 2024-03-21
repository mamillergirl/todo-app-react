import React, { useState, useEffect } from "react";
import TodoItem from "./TodoItem";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { faPlus, faTh, faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState(new Date());
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [sortBy, setSortBy] = useState("added"); // Default sort by added
  const [layoutMode, setLayoutMode] = useState("flex"); // Default layout mode

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos'));
    if (storedTodos && Array.isArray(storedTodos) && storedTodos.length > 0) {
      // Convert deadline strings back to Date objects
      const todosWithDateObjects = storedTodos.map(todo => ({
        ...todo,
        deadline: new Date(todo.deadline)
      }));
      setTodos(todosWithDateObjects);
    }
  }, []);

  const saveTodosToLocalStorage = (updatedTodos) => {
    // Convert deadline properties of todos back to ISO string format
    const todosToSave = updatedTodos.map(todo => ({
      ...todo,
      deadline: todo.deadline.toISOString()
    }));
  
    localStorage.setItem("todos", JSON.stringify(todosToSave));
  };

  const handleAddTodo = () => {
    if (name.trim() !== "" && description.trim() !== "") {
      const newTodo = {
        id: Date.now(),
        name,
        description,
        deadline: new Date(deadline), // Ensure deadline is a Date object
        done: false,
      };
      setTodos([...todos, newTodo]);
      setName("");
      setDescription("");
      setDeadline(new Date());
      saveTodosToLocalStorage([...todos, newTodo]);
    }
  };

  const handleDeleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    saveTodosToLocalStorage(updatedTodos);
  };

  const handleToggleDone = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    );
    setTodos(updatedTodos);
    saveTodosToLocalStorage(updatedTodos);
  };

  const updateTodo = (updatedTodo) => {
    const updatedTodos = todos.map(todo =>
      todo.id === updatedTodo.id ? updatedTodo : todo
    );
    setTodos(updatedTodos);
    saveTodosToLocalStorage(updatedTodos);
  };

  // Function to handle sorting based on selected option
  const handleSortByChange = (e) => {
    setSortBy(e.target.value);
  };

  // Function to sort todos based on selected option
  const sortTodos = (todos) => {
    switch (sortBy) {
      case "added":
        return todos.slice().sort((a, b) => a.id - b.id); // Sort by added
      case "dueDateAsc":
        return todos.slice().sort((a, b) => a.deadline - b.deadline); // Sort by due date ascending
      case "dueDateDesc":
        return todos.slice().sort((a, b) => b.deadline - a.deadline); // Sort by due date descending
      default:
        return todos;
    }
  };

  // Function to toggle layout mode between flex and grid
  const toggleLayoutMode = () => {
    setLayoutMode(layoutMode === "flex" ? "grid" : "flex");
  };

  return (
    <>
    <div className="w-full flex justify-between bg-blue-500 text-white">
    <h1 className="text-2xl px-4 py-2 font-bold sm:mx-36">Todo List</h1>
   
    </div>
    <div className="max-w-[80%] mx-auto">
      <div className="flex justify-between items-center mb-4">
       
        
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between align-center items-center mb-4">
      <div className="flex mw-1/3 items-center mb-4">
        <label className="ml-4 mr-3 ">Sort By:</label>
        <select
          value={sortBy}
          onChange={handleSortByChange}
          className="px-4 py-2 border border-gray-300 rounded"
        >
          <option value="added">Added</option>
          <option value="dueDateAsc">Due Date (Asc)</option>
          <option value="dueDateDesc">Due Date (Desc)</option>
        </select>
      </div>
      <div className="flex  items-center ">
      <button
            onClick={() => setIsAddingTodo(!isAddingTodo)}
            className="bg-green-500  text-white p-2 mb-5 mr-2  rounded"
          >
            {isAddingTodo ? "Hide Add Todo -" : "Add Todo +"}
          </button>
      <button
            onClick={toggleLayoutMode}
            className="bg-blue-500 text-white mb-5  rounded"
          >
            <FontAwesomeIcon icon={layoutMode === "flex" ? faTh : faBars} className="text-2xl p-2" />
          </button>
          </div>
     
      </div>
      {isAddingTodo && (
        <div className="mb-4  flex flex-col">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded mb-2"
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded mb-2"
          />
          <DatePicker
            selected={deadline}
            onChange={(date) => setDeadline(date)}
            dateFormat="MM/dd/yyyy"
            className="w-full px-4 py-2 border border-gray-300 rounded mb-2"
          />
          <button
            onClick={handleAddTodo}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      )}
      <div className={layoutMode === "flex" ? "flex flex-col" : "grid  grid-cols-1 sm:grid-cols-2 gap-4"}>
        <div>
       <h2 className="text-xl px-4 py-2 font-bold my-2">Pending</h2>

        <div className={layoutMode === "flex" ? "flex flex-col" : "grid grid-cols-2 gap-4"}>

          {sortTodos(todos).map((todo) => (
            !todo.done &&
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={handleDeleteTodo}
              onToggleDone={handleToggleDone}
              onUpdate={updateTodo} // Pass onUpdate function
            />
          ))}
        </div>
        </div>
        <div>
      <h2 className="text-xl px-4 py-2 font-bold my-2">Completed</h2>

      <div className={layoutMode === "flex" ? "flex flex-col" : "grid grid-cols-2 m-auto gap-4"}>
      
        {sortTodos(todos).map((todo) => (
          todo.done &&
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={handleDeleteTodo}
            onToggleDone={handleToggleDone}
            onUpdate={updateTodo} // Pass onUpdate function
          />
        ))}
        </div>
      </div>
    </div>
    </div>
    </>
  );
};

export default App;
