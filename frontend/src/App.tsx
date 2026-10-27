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
const columns: Array<{ key: keyof Board; title: string; tone: string }> = [
  { key: 'todo', title: 'TO DO', tone: 'pink' },
  { key: 'doing', title: 'DOING', tone: 'cyan' },
  { key: 'done', title: 'DONE', tone: 'lime' },
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
    <div className="stage">
      <header className="banner">
        <h1>TASK<br />PULSE</h1>
        <p>Жёсткий канбан без воды. Кидай задачу — двигай статус.</p>
      </header>

      <form className="composer" onSubmit={createTask}>
        <input
          className="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Название задачи"
          required
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Короткое описание"
        />
        <div className="composer-row">
          <select value={priority} onChange={(e) => setPriority(Number(e.target.value))}>
            <option value={1}>P1 · срочно</option>
            <option value={2}>P2 · обычно</option>
            <option value={3}>P3 · потом</option>
          </select>
          <button type="submit">ADD TASK</button>
        </div>
      </form>

      <div className="board">
        {columns.map((col) => (
          <section key={col.key} className={`col ${col.tone}`}>
            <h2>
              {col.title}
              <span>{board[col.key].length}</span>
            </h2>
            {board[col.key].map((task) => (
              <article key={task.id} className="card">
                <div className="card-top">
                  <strong>{task.title}</strong>
                  <span className={`p p${task.priority}`}>P{task.priority}</span>
                </div>
                {task.description && <p>{task.description}</p>}
                <div className="moves">
                  {columns
                    .filter((c) => c.key !== col.key)
                    .map((c) => (
                      <button key={c.key} type="button" onClick={() => moveTask(task, c.key)}>
                        → {c.title}
                      </button>
                    ))}
                  <button type="button" className="x" onClick={() => removeTask(task.id)}>
                    удалить
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
