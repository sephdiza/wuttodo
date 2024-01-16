import axios from 'axios';
import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import TrashIcon from '@/components/TrashIcon';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';

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
  const [disableClear, setDisableClear] = useState(true);

  const { toast } = useToast();

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
      await handleDeleteTodo(todoId);
    }

    setTodos((prevTodos) => {
      const newTodos = prevTodos.filter(
        (todo) => !selectedTodos.includes(todo.id),
      );
      return newTodos;
    });

    setSelectedTodos([]);
  }

  async function handleDeleteTodo(id: string) {
    try {
      await axios.delete(`${API_URL}/${id}`);
      const todoToDelete = todos.find((todo) => todo.id);

      const newTodos = todos.filter((todo) => todo.id !== id);

      toast({
        description: `${todoToDelete?.name} deleted.`,
        duration: 3000,
        className: 'bg-green-100',
      });
      setTodos(newTodos);
    } catch (error) {
      console.error(error);
    }
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

    console.log(newSelected.length);

    setDisableClear(newSelected.length === 0);
  }

  if (error) <div>Something went wrong</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          wut todo?
        </h1>
      </header>
      <main className="w-full max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <form
            className="flex gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateTodo();
            }}
          >
            <Input
              onChange={(e) => setNewTodo(e.target.value)}
              value={newTodo}
              className="w-full"
              placeholder="Add a new task..."
            />
            <Button className="" type="submit">
              Add Task
            </Button>
          </form>

          <ul className="mt-6 space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-2"
              >
                <div className="flex items-center space-x-4">
                  <Checkbox
                    id={todo.id}
                    onClick={() => handleTodoSelected(todo.id)}
                  />
                  <Label
                    className="text-gray-900 dark:text-gray-100"
                    htmlFor={todo.id}
                  >
                    {todo.name}
                  </Label>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDeleteTodo(todo.id)}
                >
                  <TrashIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <span className="sr-only">Delete task</span>
                </Button>
              </li>
            ))}
          </ul>

          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={handleDeleteTodos}
            disabled={disableClear}
          >
            Clear completed
          </Button>
        </div>
      </main>
      <Toaster />
    </div>
  );
}

export default App;
