# Suvidha Foundation — Summarizer App

## Hosted (production) — Live links

- Frontend: https://ai-summarizer-app-pi.vercel.app/
- Backend: https://ai-summarizer-app-c4hj.onrender.com

## Overview

This repository contains a small full-stack summarization application built with a Node.js backend and a React (Vite) frontend. The project uses MongoDB for persistent storage, Redis for worker queueing, and a background worker to process summary jobs.

Repository layout

- `backend/` — Express API, models, queues, worker, and tests.
- `frontend/` — React + Vite single-page app.
- `docker-compose.yml` — Convenient local development setup (backend, frontend, mongo, redis, worker).

## Tech stack

- Backend: Node.js, Express
- Queue/Worker: Redis-based queue (worker runs `api/workers/summaryWorker.js`)
- Database: MongoDB
- Frontend: React (Vite)
- Containerization: Docker + docker-compose

## Quick start (recommended: Docker)

This project includes a `docker-compose.yml` that starts all services together:

- backend service mapped to host port 8000
- frontend service mapped to host port 3000 (proxy to Vite dev server port 4173)
- mongo mapped to 27017
- redis mapped to 6379
- a separate `worker` container that runs the summary worker

To start everything:

```bash
# from repository root
docker-compose up --build
```

After everything starts:
- Frontend UI: http://localhost:3000
- Backend API: http://localhost:8000

To run services in the background:

```bash
docker-compose up -d --build
```

To stop and remove the containers:

```bash
docker-compose down
```

## Backend

The backend is located in the `backend/` folder. It exposes API routes and runs a worker process to generate summaries asynchronously.

Primary folders:
- `api/controllers/` — controllers for articles, summaries, and users.
- `api/routes/` — route declarations (see `articles.routes.js`, `summary.routes.js`, `user.routes.js`).
- `models/` — Mongoose models for Article, Summary, User.
- `queues/` — queue setup (job producer).
- `workers/` — `summaryWorker.js` consumes jobs from Redis and processes summaries.
- `test/` — server-side tests.

Environment variables

The backend uses a `.env` file in the `backend/` folder (not checked into the repo). Create `backend/.env` with at least the following variables (adjust names to match your local code if necessary):

```env
PORT=8000
MONGO_URI=mongodb://mongo:27017/yourdb
JWT_SECRET=your_jwt_secret_here
REDIS_HOST=your_redis_host
REDIS_PORT=6379
# any other keys your backend expects (API keys, etc.)
```

Note: The exact variable names used by the code should be verified inside `backend/api/config` and `backend/.env` (if provided). If you run the backend outside Docker, set `MONGO_URI` to a reachable MongoDB instance (e.g. `mongodb://localhost:27017/yourdb`).

Run backend locally (without Docker)

```bash
cd backend
npm install
npm run dev   # or `npm start` depending on the package.json scripts
```

## Frontend

The frontend is a Vite app in `frontend/` built with React.

Quick start (local, without Docker):

```bash
cd frontend
npm install
npm run dev
```

That will start the Vite dev server (default port 4173). The `docker-compose` setup maps it to host port 3000 for convenience.

## API and Routes

Routes and controllers live in `backend/api/routes` and `backend/api/controllers`. The project exposes endpoints related to users, articles, and summaries — see the route files for exact paths and expected payloads.

If you need to explore available endpoints quickly, open the route files:

- `backend/api/routes/user.routes.js`
- `backend/api/routes/articles.routes.js`
- `backend/api/routes/summary.routes.js`

You can then test endpoints with curl, Postman, or the frontend UI.

## Testing

There are tests under `backend/test/`. To run the backend tests:

```bash
cd backend
npm install
npm test
```

(Confirm the exact test command in `backend/package.json`.)

## Worker / Queue

A Redis-backed queue processes summary jobs in the background. The worker code is at `backend/workers/summaryWorker.js` and the queue producer is at `backend/queues/summaryQueue.js`.

When running with `docker-compose`, a separate `worker` container is defined which executes the worker script.

## Development notes & tips

- If you modify backend code and run the API locally, use nodemon (or the `dev` script) for auto-reload.
- To debug the worker locally, run the worker script directly with Node and ensure Redis is reachable.
- If Mongo or Redis addresses differ on your machine, change `MONGO_URI`, `REDIS_HOST`, and `REDIS_PORT` as needed.

## Contributing

- Open issues for bugs or feature requests.
- Use feature branches and create pull requests.
- Provide tests for new or changed backend behavior.

## Where to look next

- Backend entry points: `backend/index.js` and `backend/app.js`
- Frontend entry point: `frontend/src/main.jsx` and `frontend/src/App.jsx`
- Docker config: `docker-compose.yml`, and `backend/Dockerfile`, `frontend/Dockerfile`

## API examples (curl)

Base URL (when running with docker-compose): http://localhost:8000

Note: the backend mounts API routes under the `/api` prefix. The examples below use the full paths the frontend also uses (i.e. `http://localhost:8000/api/...`).

Authentication & user endpoints

Register a new user

```bash
curl -X POST http://localhost:8000/api/users/register \
	-H "Content-Type: application/json" \
	-d '{"name":"Alice","email":"alice@example.com","password":"password123","bio":"Optional bio"}'
```

Login (returns a JWT token)

```bash
curl -s -X POST http://localhost:8000/api/users/login \
	-H "Content-Type: application/json" \
	-d '{"email":"alice@example.com","password":"password123"}'

# Example: extract token with jq (optional)
TOKEN=$(curl -s -X POST http://localhost:8000/api/users/login \
	-H "Content-Type: application/json" \
	-d '{"email":"alice@example.com","password":"password123"}' | jq -r '.token')
```

Get current user (requires Authorization header)

```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:8000/api/user
```

Get all users (public endpoint)

```bash
curl http://localhost:8000/api/users
```

Articles endpoints (mounted under `/api/users` in the backend)

Get all articles (public)

```bash
curl http://localhost:8000/api/users/articles
```

Create an article (authenticated) — requires `userId` in the URL and the logged-in user's token

```bash
curl -X POST http://localhost:8000/api/users/<USER_ID>/articles \
	-H "Authorization: Bearer $TOKEN" \
	-H "Content-Type: application/json" \
	-d '{"title":"My Article","content":"Long article text..."}'
```

Get a single article (authenticated)

```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:8000/api/users/<USER_ID>/article/<ARTICLE_ID>
```

Get articles by user (authenticated)

```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:8000/api/users/<USER_ID>/articles
```

Update an article (authenticated)

```bash
curl -X PATCH http://localhost:8000/api/users/<USER_ID>/articles/<ARTICLE_ID> \
	-H "Authorization: Bearer $TOKEN" \
	-H "Content-Type: application/json" \
	-d '{"title":"Updated title","content":"Updated content"}'
```

Delete an article (authenticated)

```bash
curl -X DELETE http://localhost:8000/api/users/<USER_ID>/articles/<ARTICLE_ID> \
	-H "Authorization: Bearer $TOKEN"
```

Summary endpoints (mounted under `/api/articles` in the backend)

Create/generate a summary (the endpoint will queue/compute the summary). Body requires a field named `article` containing the text to summarize.

```bash
curl -X POST http://localhost:8000/api/articles/create-summary \
	-H "Authorization: Bearer $TOKEN" \
	-H "Content-Type: application/json" \
	-d '{"article":"Very long article text to summarize..."}'
```

Save a summary to the database (authenticated). Body requires `article` and `summaryText` fields.

```bash
curl -X POST http://localhost:8000/api/articles/summary \
	-H "Authorization: Bearer $TOKEN" \
	-H "Content-Type: application/json" \
	-d '{"article":"Original article text","summaryText":"Short summary text"}'
```

Get all summaries (authenticated)

```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:8000/api/articles/summaries
```

Get, update, delete a specific summary (authenticated)

```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:8000/api/articles/summary/<SUMMARY_ID>

curl -X PATCH http://localhost:8000/api/articles/summary/<SUMMARY_ID> \
	-H "Authorization: Bearer $TOKEN" \
	-H "Content-Type: application/json" \
	-d '{"article":"Updated article text","summaryText":"Updated summary"}'

curl -X DELETE http://localhost:8000/api/articles/summary/<SUMMARY_ID> \
	-H "Authorization: Bearer $TOKEN"
```

Notes

- Replace `<USER_ID>`, `<ARTICLE_ID>`, and `<SUMMARY_ID>` with actual MongoDB IDs returned by the API responses.
- Protected routes require `Authorization: Bearer <JWT>` header returned from the login endpoint.
- Article create endpoint expects `title` and `content`.
- Summary generation endpoint (`/api/articles/create-summary`) expects an `article` string; saving a summary (`/api/articles/summary`) expects `article` and `summaryText`.

## Frontend: auth & routing (how it works)

- Routing: defined in `src/App.jsx` using React Router. Main routes: `/` (Dashboard), `/signup`, `/login`, `/history`, `/summarize`.
- Auth state: `src/context/AuthContext.jsx` provides `user`, `token`, `login()` and `logout()` to the app via a React Context.
	- `token` is saved to `localStorage` and read on app load. When a token exists, `AuthProvider` calls the backend `/api/user` endpoint to fetch the current user and populate `user`.
	- `login(credentials)` calls `/api/users/login`. On success it stores the returned JWT and user in state and `localStorage`.
	- `logout()` clears token and user state (frontend also removes stored token on 401 responses via axios interceptor).
- API client: `src/api/axiosClient.js` sets `baseURL` to `http://localhost:8000/api` and automatically attaches `Authorization: Bearer <token>` to requests (reads token from `localStorage`). It also handles 401 responses by clearing stored auth state.
- Page-level protection: several pages check for `token` (and react to 401 responses) and redirect users to `/login` when unauthenticated (e.g. `Summarize`, `History`, `Dashboard`).

---
