<p align="center">
  <img src="public/logo.png" alt="NotMemTime" width="160" />
</p>

<h1 align="center">
  <em><span style="color: #f87171">NOT</span>MEM<span style="color: #0ea5e9">TIME</span></em>
</h1>

A Nuxt 4 frontend for managing clients, projects, and tasks, and for logging time against that work.

The app talks to an external REST API through a server-side proxy. The browser never sees the API key.

## Features

- **Work management** — paginated tree of clients, with nested projects and tasks
- **Time tracking** — list, create, and edit time entries (task, comment, start/end)
- **Status badges** — `active`, `pending`, `in-progress`, `completed`
- Sidebar navigation; `/` redirects to work management

## Stack

- [Nuxt 4](https://nuxt.com) and [Nuxt UI](https://ui.nuxt.com)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Zod](https://zod.dev) for form validation
- [pnpm](https://pnpm.io) (`packageManager`: `pnpm@12.9.1`)

## Setup

Node 24 is what CI uses. Copy env vars, then install:

```bash
cp .env.example .env
pnpm install
```

### Environment

| Variable            | Description                                                    |
| ------------------- | -------------------------------------------------------------- |
| `NUXT_API_BASE_URL` | Backend API origin (Nitro `runtimeConfig.apiBaseUrl`)          |
| `NUXT_API_KEY`      | Bearer token sent by the server proxy (`runtimeConfig.apiKey`) |

These are server-only. Do not prefix them with `NUXT_PUBLIC_`.

## Scripts

| Command                           | What it does                          |
| --------------------------------- | ------------------------------------- |
| `pnpm dev`                        | Dev server at `http://localhost:3000` |
| `pnpm build`                      | Production build                      |
| `pnpm preview`                    | Preview the production build          |
| `pnpm lint` / `pnpm lint:fix`     | ESLint                                |
| `pnpm format` / `pnpm format:fix` | Prettier                              |
| `pnpm typecheck`                  | `nuxt typecheck`                      |

On push, GitHub Actions runs `pnpm lint` and `pnpm typecheck`.

## Docker

The image is a production Nitro server. Set `NUXT_API_BASE_URL` and `NUXT_API_KEY` at **run** time (they are not baked in at build).

```bash
cp .env.example .env
docker compose up --build
```

The app listens on `http://localhost:3000`. `GET /api/health` is used as the container health check.

Without Compose:

```bash
docker build -t notmemtime .
docker run --rm -p 3000:3000 --env-file .env notmemtime
```

## How the API is wired

The UI calls same-origin `/api/*` routes via `app/services/api.ts`.

Nitro handlers in `server/api/` forward those requests to `NUXT_API_BASE_URL` with `Authorization: Bearer <NUXT_API_KEY>`. `GET /api/health` is a local liveness check and is not proxied.

| Client helper                       | Upstream                                         |
| ----------------------------------- | ------------------------------------------------ |
| `api.clients.getAll` / `getById`    | `/clients`, `/clients/:id`                       |
| `api.clients.getProjects`           | `/clients/:id/projects`                          |
| `api.projects.getById` / `getTasks` | `/projects/:id`, `/projects/:id/tasks`           |
| `api.tasks.getById`                 | `/tasks/:id`                                     |
| `api.timeEntries.*`                 | `/time-entries` (`GET`, `POST`, `PUT`, `DELETE`) |

Shared TypeScript types live in `shared/types`.

## Project layout

```
app/
  pages/                 work-management, time-tracking
  components/            tree, time-entry form, shared UI
  composables/           data fetching and mutations
  services/api.ts        browser → /api proxy
server/api/              proxy + health
shared/types/            Client, Project, Task, TimeEntry
```
