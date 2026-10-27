import { FormEvent, useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

type Status = 'todo' | 'doing' | 'done'

type Task = {
  id: number
  title: string
  description: string
  status: Status
  priority: number
}

type Board = Record<Status, Task[]>

const api = axios.create({ baseURL: '/api' })

const columns: Array<{ key: Status; title: string; tone: string }> = [
  { key: 'todo', title: 'Сделать', tone: 'pink' },
  { key: 'doing', title: 'В работе', tone: 'cyan' },
  { key: 'done', title: 'Готово', tone: 'lime' },
]

const moveLabel: Record<Status, string> = {
  todo: '← В «Сделать»',
  doing: '→ В работу',
  done: '✓ Готово',
}

function App() {
  const [board, setBoard] = useState<Board>({ todo: [], doing: [], done: [] })
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState(2)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function load() {
    const { data } = await api.get<Board>('/tasks/board/')
    setBoard({
      todo: data.todo ?? [],
      doing: data.doing ?? [],
      done: data.done ?? [],
    })
  }

  useEffect(() => {
    load().catch(() => setError('Не удалось загрузить доску. Проверь, что backend на :8001 запущен.'))
  }, [])

  async function createTask(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setBusy(true)
    setError('')
    try {
      await api.post('/tasks/', {
        title: title.trim(),
        description: description.trim(),
        priority,
        status: 'todo',
      })
      setTitle('')
      setDescription('')
      setPriority(2)
      await load()
    } catch {
      setError('Не удалось добавить задачу. Backend должен быть на http://127.0.0.1:8001')
    } finally {
      setBusy(false)
    }
  }

  async function moveTask(task: Task, status: Status) {
    setError('')
    try {
      await api.patch(`/tasks/${task.id}/`, { status })
      await load()
    } catch {
      setError('Не удалось переместить задачу.')
    }
  }

  async function removeTask(id: number) {
    setError('')
    try {
      await api.delete(`/tasks/${id}/`)
      await load()
    } catch {
      setError('Не удалось удалить задачу.')
    }
  }

  return (
    <div className="stage">
      <header className="banner">
        <h1>TASK<br />PULSE</h1>
        <p>Добавь задачу → жми кнопки статуса на карточке.</p>
      </header>

      <form className="composer" onSubmit={createTask}>
        <label className="field">
          <span>Название</span>
          <input
            className="title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Например: сверстать лендинг"
            required
            maxLength={200}
          />
        </label>
        <label className="field">
          <span>Описание</span>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Коротко, по желанию"
            maxLength={500}
          />
        </label>
        <div className="composer-row">
          <label className="field compact">
            <span>Приоритет</span>
            <select value={priority} onChange={(e) => setPriority(Number(e.target.value))}>
              <option value={1}>P1 · срочно</option>
              <option value={2}>P2 · обычно</option>
              <option value={3}>P3 · потом</option>
            </select>
          </label>
          <button type="submit" disabled={busy}>
            {busy ? '...' : 'Добавить'}
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </form>

      <p className="hint">На мобиле листай колонки вправо → · на карточке жми статус</p>

      <div className="board">
        {columns.map((col) => (
          <section key={col.key} className={`col ${col.tone}`}>
            <h2>
              {col.title}
              <span>{board[col.key].length}</span>
            </h2>
            {board[col.key].length === 0 && <p className="empty">Пусто</p>}
            {board[col.key].map((task) => (
              <article key={task.id} className="card">
                <div className="card-top">
                  <strong>{task.title}</strong>
                  <span className={`p p${task.priority}`}>P{task.priority}</span>
                </div>
                {task.description && <p>{task.description}</p>}
                <div className="moves" role="group" aria-label="Сменить статус">
                  {columns
                    .filter((c) => c.key !== col.key)
                    .map((c) => (
                      <button
                        key={c.key}
                        type="button"
                        className={`move ${c.key}`}
                        onClick={() => moveTask(task, c.key)}
                      >
                        {moveLabel[c.key]}
                      </button>
                    ))}
                  <button type="button" className="x" onClick={() => removeTask(task.id)}>
                    Удалить
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
