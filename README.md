# TaskPulse

Kanban task board (pet project).

**Stack:** Django + DRF · React + TypeScript + Vite · SQLite

## Features

- create / update / delete tasks
- columns: To do / Doing / Done
- priority levels

## Run

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 127.0.0.1:8001

cd frontend
npm install
npm run dev
```

Open http://127.0.0.1:5175  
Frontend proxies `/api` → `http://127.0.0.1:8001`.
