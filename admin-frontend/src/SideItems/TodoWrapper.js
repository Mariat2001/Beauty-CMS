import React, {useState,useEffect} from 'react'
import TodoForm  from './TodoForm'
import Todo from './Todo'
import EditTodoForm from './EditTodoForm'
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from 'react-router-dom';
import './Todo.css'
import axios from "axios";

function TodoWrapper() {
  
  const [todos, setTodos] = useState([]);
  const addTodo = (todo) => {
    setTodos([
      ...todos,
      { id: uuidv4(), task: todo, completed: false, isEditing: false },
    ]);

  }

  useEffect(() => {
    fetchTodo();
  }, []);

  const fetchTodo = async () => {
    try {
      const response = await axios.post("http://localhost:8081/getTodo");
      setTodos(response.data); // Update the correct state
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching Todo:", error);
    }
  };


  const deleteTodo = (id) => setTodos(todos.filter((todo) => todo.id !== id));
  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }
  const editTask = (task, id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, task, isEditing: !todo.isEditing } : todo
      )
    );
  };

  return (
    <div className="TodoWrapper" style={{ marginTop: '15px', height: '560px', width: '400px' }}>
    <h1>Get Things Done!</h1>
    <TodoForm addTodo={addTodo} />
    <div className="TodoListContainer">
      {todos.map((todo) =>
      
          <Todo
            key={todo.id}
            task={todo}
            deleteTodo={deleteTodo}
            // Pass the correct function
            toggleComplete={toggleComplete}
          />
        )
      }
    </div>
  </div>
  )
}

export default TodoWrapper
