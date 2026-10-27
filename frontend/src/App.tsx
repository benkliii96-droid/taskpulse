import { FormEvent, useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

type Task = {
  id: number
  title: string
  description: string
  status: 'todo' | 'doing' | 'done'
  priority: number
}

type Board = {
  todo: Task[]
  doing: Task[]
  done: Task[]
}

const api = axios.create({ baseURL: '/api' })
const columns: Array<{ key: keyof Board; title: string }> = [
  { key: 'todo', title: 'To do' },
  { key: 'doing', title: 'Doing' },
  { key: 'done', title: 'Done' },
]

function App() {
  const [board, setBoard] = useState<Board>({ todo: [], doing: [], done: [] })
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState(2)

  async function load() {
    const { data } = await api.get<Board>('/tasks/board/')
    setBoard(data)
  }

  useEffect(() => {
    load().catch(console.error)
  }, [])

  async function createTask(e: FormEvent) {
    e.preventDefault()
    await api.post('/tasks/', { title, description, priority, status: 'todo' })
    setTitle('')
    setDescription('')
    setPriority(2)
    await load()
  }

  async function moveTask(task: Task, status: Task['status']) {
    await api.patch(`/tasks/${task.id}/`, { status })
    await load()
  }

  async function removeTask(id: number) {
    await api.delete(`/tasks/${id}/`)
    await load()
  }

  return (
    <div className="shell">
      <header>
        <h1>TaskPulse</h1>
        <p className="muted">Kanban-доска задач · Django + React</p>
      </header>

      <form className="card" onSubmit={createTask}>
        <h2>Новая задача</h2>
        <div className="row">
          <label>
            Заголовок
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label>
            Приоритет
            <select value={priority} onChange={(e) => setPriority(Number(e.target.value))}>
              <option value={1}>Высокий</option>
              <option value={2}>Средний</option>
              <option value={3}>Низкий</option>
            </select>
          </label>
        </div>
        <label>
          Описание
          <input value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <button type="submit">Добавить</button>
      </form>

      <div className="board">
        {columns.map((col) => (
          <section key={col.key} className="column">
            <h2>
              {col.title} <span>{board[col.key].length}</span>
            </h2>
            {board[col.key].map((task) => (
              <article key={task.id} className="task">
                <div className="task-top">
                  <strong>{task.title}</strong>
                  <span className={`prio p${task.priority}`}>P{task.priority}</span>
                </div>
                {task.description && <p>{task.description}</p>}
                <div className="actions">
                  {col.key !== 'todo' && (
                    <button type="button" onClick={() => moveTask(task, 'todo')}>
                      To do
                    </button>
                  )}
                  {col.key !== 'doing' && (
                    <button type="button" onClick={() => moveTask(task, 'doing')}>
                      Doing
                    </button>
                  )}
                  {col.key !== 'done' && (
                    <button type="button" onClick={() => moveTask(task, 'done')}>
                      Done
                    </button>
                  )}
                  <button type="button" className="danger" onClick={() => removeTask(task.id)}>
                    ✕
                  </button>
                </div>
              </article>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}

export default App
