# YUPLACED Frontend — React + TypeScript Step 2

## Что изменено

Step 2 продолжает безопасную миграцию после рабочей версии Step 1.

Перенесено и разложено по структуре:

- Landing
  - `widgets/landing-hero`
  - `widgets/landing-footer`
- Auth
  - `features/auth/login-form`
  - `features/auth/signup-form`
  - `features/auth/restore-password-form`
  - `widgets/auth-layout`
- Shared UI
  - `Button`
  - `TextField`
  - `PasswordStrength`
- Config
  - `shared/config/routes.ts`
- Router
  - `app/router.tsx`

## Что НЕ трогали

- YUNOTE остался в `public/legacy`
- CSS визуала сохранён
- фон частиц сохранён
- dashboard/yunote legacy-страницы не переписывались

## Маршруты

```txt
/
/login
/signup
/restore-password
```

Старые html-адреса редиректятся:

```txt
/index.html -> /
/login.html -> /login
/signup.html -> /signup
/restore-password.html -> /restore-password
```

## Запуск

```bash
npm install
npm run dev
```

Открыть:

```txt
http://localhost:5173/
```

## Следующий безопасный шаг

Step 3: переносить YUNOTE layout, но без логики экранов:

- `YunoteShell`
- `YunoteSidebar`
- `YunoteTopbar`
- подключить legacy CSS
- оставить содержимое экранов пока заглушками

После этого можно переносить по одному экрану:

1. Overview
2. Folders / Kanban
3. Daily Report
4. Pomodoro
5. Settings
