#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cleanup() {
  jobs -p | xargs -r kill
}

trap cleanup EXIT INT TERM

cd "$ROOT_DIR/backend"
if [ ! -d .venv ]; then
  python3 -m venv .venv
fi
source .venv/bin/activate
pip install -r requirements.txt >/dev/null
python manage.py migrate
deactivate

(
  cd "$ROOT_DIR/backend"
  source .venv/bin/activate
  python manage.py runserver 0.0.0.0:8000
) &

(
  cd "$ROOT_DIR/frontend"
  npm install >/dev/null
  npm run dev:host
) &

wait
