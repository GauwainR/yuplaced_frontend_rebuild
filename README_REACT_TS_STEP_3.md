# YUPLACED Frontend — React + TypeScript Migration Step 3

## Что сделано

Step 3 переносит первый слой YUNOTE в React/TypeScript:

- добавлен роутинг YUNOTE:
  - `/yunote`
  - `/yunote/overview`
  - `/yunote/folders`
  - `/yunote/daily-report`
  - `/yunote/pomodoro`
  - `/yunote/settings`
- добавлен общий каркас YUNOTE:
  - `widgets/yunote-layout`
  - `widgets/yunote-header`
  - `widgets/yunote-tabs`
- перенесён Overview:
  - `pages/yunote/overview`
  - `widgets/today-focus`
  - `widgets/yunote-overview`
- добавлены базовые сущности:
  - `entities/task/model/types.ts`
  - `entities/folder/model/types.ts`
- добавлены общие UI-компоненты:
  - `shared/ui/card`
  - `shared/ui/badge`

## Что специально НЕ трогалось

- YUNOTE legacy-файлы остались в `public/legacy`
- Folders / Daily Report / Pomodoro / Settings пока являются React shell placeholders
- Backend API ещё не подключался
- Zustand / TanStack Query ещё не добавлялись

## Запуск

```bash
npm install
npm run dev
```

Открыть:

```text
http://localhost:5173/yunote/overview
```

## Следующий шаг

Step 4 — перенос Folders / Kanban в React + TypeScript.
