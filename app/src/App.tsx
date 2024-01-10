import { useEffect, useState } from 'react'

interface Todo {
  id: string,
  name: string,
  status: string,
}

function App() {
  const [todos, setTodos] = useState<Todo[]>()
  const [error, setError] = useState('')

  async function fetchTodos() {
    try {
      const response = await fetch('https://wuttodo.onrender.com/todos')
      const data: Todo[] = await response.json()
      setTodos(data)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch(error: any) {
      console.error(error)
      setError(error)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  if (error) <div>Something went wrong</div>

  return (
    <div>
      {todos?.map((todo) => (
        <li key={todo.id}>
          {todo.name}: {todo.status}
        </li>
      ))}
    </div>
  )
}

export default App
