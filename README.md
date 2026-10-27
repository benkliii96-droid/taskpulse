# TaskPulse

Канбан-доска задач: колонки «Сделать / В работе / Готово», приоритеты, смена статуса. Pet-project на Django + React.

## Стек

| Слой | Технологии |
|------|------------|
| Backend | Python, Django, Django REST Framework, SQLite |
| Frontend | React, TypeScript, Vite |
| API | REST JSON (ViewSet + board endpoint) |

## Что умеет

- создание / удаление задач
- три колонки: todo / doing / done
- приоритеты P1–P3
- перевод задачи между колонками кнопками статуса
- адаптивная доска (на мобиле колонки листаются горизонтально)

## Как устроен прокси

Vite проксирует `/api` на Django:

```
браузер → http://127.0.0.1:5173/api/...
              ↓ (vite proxy)
         http://127.0.0.1:8000/api/...
```

Настройка в `frontend/vite.config.ts`:

```ts
proxy: { '/api': 'http://127.0.0.1:8000' }
```

Backend: обычный `python manage.py runserver` → **порт 8000**.

Если API «молчит», чаще всего Django не запущен на `8000`, а фронт уже открыт.

## Запуск

Нужны: Python 3.11+, Node.js 18+.

**1. Backend** (из корня репозитория):

```bash
python -m venv .venv
# Windows:
.venv\Scripts\activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend: `http://127.0.0.1:8000`

**2. Frontend** (второй терминал):

```bash
cd frontend
npm install
npm run dev
```

**3. Открыть в браузере**

Смотри строку `Local:` в терминале Vite. Обычно:

```
http://127.0.0.1:5173/
```

Не хардкодь другие порты — Vite сам выберет свободный, если `5173` занят.

## API

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/tasks/` | список |
| POST | `/api/tasks/` | создать |
| PATCH | `/api/tasks/{id}/` | обновить (в т.ч. status) |
| DELETE | `/api/tasks/{id}/` | удалить |
| GET | `/api/tasks/board/` | доска `{ todo, doing, done }` |

## Структура

```
taskpulse/
  config/       # Django
  boards/       # Task model + API
  frontend/     # React
  manage.py
  requirements.txt
```
