#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$BACKEND_DIR"

PYTHON_BIN=".venv/bin/python"
if [[ ! -x "$PYTHON_BIN" ]]; then
  PYTHON_BIN="python3"
fi

PYTHONPATH=. "$PYTHON_BIN" -c "from dotenv import load_dotenv; load_dotenv(); from utils.cache import is_redis_alive; print('Redis connected:', is_redis_alive())"
