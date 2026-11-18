#!/usr/bin/env bash
# Rebuilds the one-page CV PDF from public/cv.html (the CV's only source) using headless Chrome.
# Usage (Git Bash, from the project root):  bash cv/build-cv.sh
# Needs an internet connection so the Inter and Lora fonts load.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && (pwd -W 2>/dev/null || pwd))"
chrome="${CHROME:-C:/Program Files/Google/Chrome/Application/chrome.exe}"
out="$root/public/assets/abdulmalik-altamimi.pdf"

MSYS_NO_PATHCONV=1 "$chrome" --headless=new --disable-gpu --no-pdf-header-footer \
    --virtual-time-budget=10000 \
    --print-to-pdf="$out" \
    "file:///$root/public/cv.html"

echo "Wrote $out"
