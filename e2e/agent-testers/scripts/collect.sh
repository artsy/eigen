#!/usr/bin/env bash
# Run on YOUR machine: downloads every encrypted artifact of a run and decrypts it.
# Usage (from e2e/agent-testers): bash scripts/collect.sh <run_id> [private_key.pem] [out_dir]
# Default key: the one setup.sh created in ~/.mobile-agent-testers/
set -euo pipefail
RUN=$1
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
PRIV=${2:-$HOME/.mobile-agent-testers/${REPO//\//_}.pem}; OUT=${3:-runs/$1}
mkdir -p "$OUT/enc"
gh run download "$RUN" -D "$OUT/enc"
for key in "$OUT"/enc/*/*.key.bin; do
  name=$(basename "$key" .key.bin); dir=$(dirname "$key")
  pass=$(openssl pkeyutl -decrypt -inkey "$PRIV" -pkeyopt rsa_padding_mode:oaep -in "$key")
  mkdir -p "$OUT/$name"
  openssl enc -d -aes-256-cbc -pbkdf2 -in "$dir/$name.tgz.enc" -pass "pass:$pass" | tar xz -C "$OUT/$name"
  python3 "$(dirname "$0")/agent_status.py" "$OUT/$name/results/agent-output.json" "$OUT/$name/results/agent-errors.txt" "$name" || true
done
python3 "$(dirname "$0")/summarize.py" "$OUT" > "$OUT/SUMMARY.md" && echo "Summary: $OUT/SUMMARY.md"
