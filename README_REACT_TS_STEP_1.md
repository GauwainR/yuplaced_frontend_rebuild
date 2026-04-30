# YUPLACED Frontend — React + TypeScript migration, Step 1

В этом архиве мигрированы только публичные страницы:

- Landing (`/`)
- Login (`/login`)
- Sign up (`/signup`)

YUNOTE и остальные старые страницы пока оставлены в `public/legacy/`, чтобы не ломать текущий продуктовый UI.

## Запуск

```bash
npm install
npm run dev
```

Открой:

```text
http://localhost:5173/
```

## Backend URL

По умолчанию API смотрит сюда:

```text
http://localhost:8000/api
```

Можно переопределить через `.env`:

```text
VITE_API_URL=http://localhost:8000/api
```

## Что изменено

- Создан проект Vite + React + TypeScript.
- `index.html`, `login.html`, `signup.html` перенесены в React-компоненты.
- Фон частиц перенесён в компонент `BackgroundCanvas`.
- Auth API вынесен в `src/shared/api/authApi.ts`.
- Навигация вынесена в `src/shared/ui/Nav.tsx`.
- Визуал сохранён через старые CSS-токены и стили.

## Структура

```text
src/
  app/
    App.tsx
  pages/
    landing/
      LandingPage.tsx
    auth/
      AuthLayout.tsx
      LoginPage.tsx
      SignupPage.tsx
  shared/
    api/
      authApi.ts
    ui/
      BackgroundCanvas.tsx
      Nav.tsx
  styles/
    base.css
    landing.css
    auth.css
```

## Legacy

Старая версия проекта лежит здесь:

```text
public/legacy/
```

Например старый YUNOTE доступен по:

```text
/legacy/pages/yunote.html
```

## Следующий шаг

Следующим шагом можно мигрировать YUNOTE по одному экрану:

1. Overview
2. Folders
3. Daily Report
4. Pomodoro
5. Settings
```
