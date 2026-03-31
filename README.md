# Workout Tracker

A full-stack workout tracker built with Nuxt 4, Nuxt UI, Django REST Framework, PostgreSQL, and Traefik.

## What it includes

- Calendar-based workout planning with nested exercises and sets
- Dashboard cards plus charts for body weight, reps, weight, and volume trends
- Exercise library management
- Profile editing and password changes
- Body weight logging
- JWT authentication
- Docker Compose deployment with Postgres and Traefik
- Backend tests, frontend unit tests, and Playwright browser tests

## Local development

### Quick start

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
./scripts/dev.sh
```

Frontend runs on `http://localhost:3000` and backend runs on `http://localhost:8000`.

## Testing

Run everything:

```bash
./scripts/test.sh
```

Individual commands:

```bash
cd backend && source .venv/bin/activate && python manage.py test
cd frontend && npm run test:unit
cd frontend && npm run test:e2e
```

## Docker deployment

### Quick start

```bash
cp .env.example .env
./scripts/docker-up.sh
```

The app is available through Traefik on `http://localhost`.

Useful endpoints:

- Frontend: `http://localhost`
- Django admin: `http://localhost/admin`
- API health check: `http://localhost/api/health/`
- Traefik dashboard: `http://localhost:8080`

Stop the stack:

```bash
./scripts/docker-down.sh
```
