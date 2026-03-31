#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT_DIR/backend"
if [ ! -d .venv ]; then
  python3 -m venv .venv
fi
source .venv/bin/activate
pip install -r requirements.txt >/dev/null
python manage.py test
deactivate

cd "$ROOT_DIR/frontend"
npm install >/dev/null
npm run test:unit
npm run test:e2e:install
npm run test:e2e
