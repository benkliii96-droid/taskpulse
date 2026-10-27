# TaskPulse

Канбан задач: todo / doing / done, приоритеты.

**Стек:** Django + DRF, React + TypeScript + Vite, SQLite

## Функции

- создание и удаление задач
- смена статуса между колонками
- приоритеты P1–P3

## Прокси

`frontend/vite.config.ts`:

```ts
proxy: { '/api': 'http://127.0.0.1:8000' }
```

`/api/*` → Django `:8000` (`python manage.py runserver`).

## Запуск

```bash
# backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# frontend (второй терминал)
cd frontend
npm install
npm run dev
```

Открыть URL из вывода Vite (`Local:`), обычно `http://127.0.0.1:5173`.

## API

| Метод | Путь |
|-------|------|
| GET/POST | `/api/tasks/` |
| PATCH/DELETE | `/api/tasks/{id}/` |
| GET | `/api/tasks/board/` |
