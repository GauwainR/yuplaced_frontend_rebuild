# Step 3.1 Fix — no legacy served

Причина редиректа на legacy была в том, что папка `public/legacy` попадала в Vite как статические файлы.
Маршруты React Router не могут перехватить `/legacy/pages/*.html`, если такой файл физически лежит в `public`.

Что исправлено:

- `public/legacy` перенесён в `legacy_archive/legacy`.
- Legacy больше не обслуживается dev-сервером Vite.
- `/yunote` ведёт на `/yunote/overview`.
- `/dashboard.html` и `/yunote.html` редиректятся на React `/yunote/overview`.
- Визуал React-страниц не менялся.

Проверка:

```bash
npm install
npm run dev
```

Открыть:

```text
http://localhost:5173/yunote
http://localhost:5173/yunote/overview
```

Если браузер всё равно показывает старую страницу, очисти адрес вручную и открой `/yunote/overview`, либо сделай hard reload `Ctrl+F5`.
