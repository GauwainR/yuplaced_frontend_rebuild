# Step 3.1 — Routing fix

Цель фикса: полностью убрать активные переходы на legacy из React-навигации.

## Что исправлено

- `/yunote` теперь редиректит на `/yunote/overview`.
- Login после успешного входа ведёт на `/yunote/overview`, а не на legacy dashboard.
- Sign up после регистрации ведёт на `/yunote/overview`.
- Placeholder-страницы YUNOTE больше не показывают ссылку `Open legacy version`.
- Из `routes.ts` убраны legacy-маршруты как часть активной навигации.
- Добавлены редиректы со старых HTML-путей на React-маршруты:
  - `/index.html` → `/`
  - `/login.html` → `/login`
  - `/signup.html` → `/signup`
  - `/dashboard.html` → `/yunote/overview`
  - `/yunote.html` → `/yunote/overview`

## Проверка

```bash
npm install
npm run dev
```

Открыть:

```text
http://localhost:5173/yunote
```

Ожидаемо:

```text
http://localhost:5173/yunote/overview
```

После логина или регистрации переход также должен вести на `/yunote/overview`.

## Что не трогалось

- Визуал
- CSS
- Legacy-файлы в `public/legacy`
- Placeholder-разделы YUNOTE
- API-слой
