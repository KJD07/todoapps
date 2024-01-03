import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TodoList = ({ token }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(response.data.tasks);
    } catch (error) {
      console.error(error.response.data.error);
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tasks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setTasks(response.data.tasks);
      } catch (error) {
        console.error(error.response.data.error);
      }
    };
  
    fetchTasks(); // Invoke fetchTasks directly in the useEffect
  
  }, [token]);
  

  const handleAddTask = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/tasks',
        { task: newTask },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNewTask('');
      // Fetch tasks again after adding a new task
      fetchTasks();
    } catch (error) {
      console.error(error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Todo List</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>{task.task}</li>
        ))}
      </ul>
      <div>
        <label>New Task:</label>
        <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} />
      </div>
      <button onClick={handleAddTask}>Add Task</button>
    </div>
  );
};

export default TodoList;
