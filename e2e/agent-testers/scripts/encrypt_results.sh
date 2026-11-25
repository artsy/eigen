#!/usr/bin/env bash
# Encrypts results/ with results_public.pem (RSA-OAEP wraps a random AES key).
# The repo is public: only the holder of the private key can read the output.
set -euo pipefail
NAME=${1:-results}
mkdir -p results results.enc
tar czf results.tgz results
KEY=$(openssl rand -hex 32)
echo "::add-mask::$KEY"
openssl enc -aes-256-cbc -pbkdf2 -salt -in results.tgz -out "results.enc/$NAME.tgz.enc" -pass "pass:$KEY"
printf '%s' "$KEY" | openssl pkeyutl -encrypt -pubin -inkey results_public.pem \
  -pkeyopt rsa_padding_mode:oaep -out "results.enc/$NAME.key.bin"
rm -f results.tgz
