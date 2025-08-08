# Vid2Text API

FastAPI service.

## Dev

Install deps (via uv):

```bash
uv pip install -r <(uv pip compile --generate-hashes --quiet pyproject.toml)
```

Run:

```bash
uvicorn src.app.main:app --reload --port 8000
```

OpenAPI docs at http://localhost:8000/docs



