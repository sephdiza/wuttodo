import axios from 'axios';
import { useEffect, useState } from 'react';

interface Todo {
  id: string;
  name: string;
  status: string;
}

const API_URL = import.meta.env.VITE_API_URL || process.env.VITE_API_URL;

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [newTodo, setNewTodo] = useState('');
  const [selectedTodos, setSelectedTodos] = useState<Todo['id'][]>([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      const response = await fetch(API_URL);
      const data: Todo[] = await response.json();
      setTodos(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      setError(error);
    }
  }

  async function handleCreateTodo(): Promise<Todo> {
    const response = await axios.post(API_URL, { name: newTodo });
    const data: Todo = await response.data;

    setTodos((prevTodos) => {
      const newTodos = [...prevTodos, data];
      return newTodos;
    });

    setNewTodo('');

    return data;
  }

  async function handleDeleteTodos() {
    for (const todoId of selectedTodos) {
      await axios.delete(`${API_URL}/${todoId}`);
    }

    setTodos((prevTodos) => {
      const newTodos = prevTodos.filter(
        (todo) => !selectedTodos.includes(todo.id),
      );
      return newTodos;
    });
  }

  function handleTodoSelected(id: string) {
    const indexOfSelecetedTodo = selectedTodos.indexOf(id);
    let newSelected = selectedTodos;
    if (indexOfSelecetedTodo < 0) {
      newSelected = [...newSelected, id];
    } else {
      newSelected.splice(indexOfSelecetedTodo, 1);
    }
    setSelectedTodos(newSelected);
    console.log(newSelected);
  }

  if (error) <div>Something went wrong</div>;

  return (
    <div>
      {todos?.map((todo) => (
        <div key={todo.id} style={{ display: 'flex', gap: '8px' }}>
          <li>
            {todo.name}: {todo.status}
          </li>
          <input type="checkbox" onChange={() => handleTodoSelected(todo.id)} />
        </div>
      ))}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateTodo();
        }}
      >
        <label>
          Add todo
          <input onChange={(e) => setNewTodo(e.target.value)} value={newTodo} />
        </label>
      </form>
      <button onClick={handleDeleteTodos}>delete selected</button>
    </div>
  );
}

export default App;
