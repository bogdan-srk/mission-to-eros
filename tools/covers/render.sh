#!/usr/bin/env bash
# Renders the share images with the game's own drawing code (needs Google Chrome + python3).
#   tools/covers/render.sh        → cover.png (1200×630) and cover-mobile.png (1080×1920) in the repo root
#   tools/covers/render.sh all    → all 6 drafts into tools/covers/out/ for comparing
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$DIR/../.." && pwd)"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
PORT="${PORT:-8767}"
TMP="$(mktemp -d)"
SERVER=""
trap '[ -n "$SERVER" ] && kill "$SERVER" 2>/dev/null; rm -rf "$TMP"' EXIT

# the game page with analytics off, UI hidden and the cover script injected
sed -e "s#const GOATCOUNTER = '[^']*';#const GOATCOUNTER = '';#" \
    -e 's#</body>#<style>\#overlay,\#lang,\#hud,\#event,\#fact,\#hint,\#landBtn,\#pad{display:none!important}</style><script src="covers.js"></script></body>#' \
    "$ROOT/index.html" > "$TMP/covers.html"
cp "$DIR/covers.js" "$TMP/"

python3 -m http.server "$PORT" --bind 127.0.0.1 --directory "$TMP" >/dev/null 2>&1 & SERVER=$!
disown "$SERVER"
sleep 1

render(){ # cover-number width height output
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --window-size="$2,$3" --virtual-time-budget=5000 --screenshot="$4" \
    "http://127.0.0.1:$PORT/covers.html?cover=$1" >/dev/null 2>&1
  echo "cover $1 → $4"
}

if [ "${1:-}" = "all" ]; then
  mkdir -p "$DIR/out"
  for n in 1 2 3 4 5; do render "$n" 1200 630 "$DIR/out/cover-$n.png"; done
  render 6 1080 1920 "$DIR/out/cover-6.png"
else
  render 1 1200 630 "$ROOT/cover.png"
  render 6 1080 1920 "$ROOT/cover-mobile.png"
fi
