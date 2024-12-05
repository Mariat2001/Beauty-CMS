import React, { useState, useEffect } from "react";
import axios from "axios";
import Todo from "./Todo";


function TodoForm({ addTodo }) {
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [todo, setTodo] = useState([]);

  useEffect(() => {
    fetchTodo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDescriptionError("");
    let isValid = true;

    if (!description) {
      setDescriptionError("Description is required");
      isValid = false;
    }

    if (isValid) {
      const formData = { description };
      console.log(formData);

      try {
        await axios.post("http://localhost:8081/addtodo", formData);
        setDescription(""); // Clear the input after submission
        fetchTodo(); // Refresh the todo list
      } catch (error) {
        console.error("Error submitting the form:", error);
      }
    }
  };

  const fetchTodo = async () => {
    try {
      const response = await axios.post("http://localhost:8081/getTodo");
      setTodo(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching Todo:", error);
    }
  };

  const handleDelete = async (todoId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8081/deleteTodo/${todoId}`
      );
      console.log(todoId);
      if (response.status === 200) {
        alert("Brand deleted successfully");
        fetchTodo(); // Fetch the updated list of brands
      } else {
        alert("Error deleting todo");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      alert("Error deleting todo");
    }
  };
  return (
    <div
      className="TodoWrapper"
      style={{ marginTop: "-20px", height: "580px", width: "350px",boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',marginLeft:'10px' }}
    >
      <h1>Get Things Done!</h1>

      <form onSubmit={handleSubmit} className="TodoForm">
        <input
          type="text"
          value={description} // Bind the input value directly to description
          onChange={(e) => setDescription(e.target.value)} // Update description
          placeholder="What is the task today?"
        />
        <button type="submit" className="todo-btn">
          Add Task
        </button>
      </form>
      {descriptionError && <p style={{ color: "red" }}>{descriptionError}</p>}

      <div className="TodoListContainer">
      <ul>
          {todo.map((item) => (
            <li key={item.id}>
              <Todo task={item} deleteTodo={handleDelete} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TodoForm;
