## Vid2Text (Monorepo)

Turn any video into instant, shareable insights. Monorepo with web (Next.js) and API (FastAPI), wired with Turborepo, linting, tests, and CI.

### Apps
- `apps/web`: Next.js 14 (App Router), TypeScript (strict), Tailwind.
- `apps/api`: FastAPI (Python 3.12), Uvicorn, Pydantic v2.

### Quickstart

Prereqs:
- Node 20+, pnpm 9+
- Python 3.12+, `uv` (https://docs.astral.sh/uv/)
- Docker (for Postgres/Redis via compose)

1) Install dependencies

```bash
pnpm install
```

2) Set env vars

Copy `.env.example` to `.env` at repo root and fill values as needed. For first run, defaults are fine.

```bash
cp .env.example .env
```

3) Start local infra (Postgres + Redis)

```bash
docker compose -f infra/docker-compose.yml up -d
```

4) Start dev servers (web + api in parallel)

```bash
pnpm dev
```

Web: http://localhost:3000  
API: http://localhost:8000 (docs: http://localhost:8000/docs)

### Sanity checks
- Web: visit `/` and see the landing page with health status from API.
- API: visit `/health` and `/docs`.

### Scripts
- `pnpm dev` – run all dev servers in parallel
- `pnpm build` – build all apps
- `pnpm lint` – lint ts & py
- `pnpm test` – run tests (API pytest for now)

### CI
GitHub Actions workflow runs lint and tests for both apps on PRs.

### Environment
See `.env.example` for required variables. Configure per-service `.env` files if desired; by default both apps read the repo root `.env`.

### License
MIT



