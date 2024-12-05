import React, {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import './Todo.css'


function Todo({task, deleteTodo, editTodo, toggleComplete}) {
  return (
    <div className="Todo">
   
    <p className={`${task.completed ? 'completed' : ''}`} onClick={() => toggleComplete(task.id)}>
      {task.description}
    </p>
    <div className="rating-container">
   
      <FontAwesomeIcon icon={faTrash} onClick={() => deleteTodo(task.id)} />
    </div>
  </div>
  )
}

export default Todo
