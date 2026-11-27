# shellcheck shell=bash
# Eigen: sourced by scripts/*/run_agent.sh. Reads the e2e test account from .env.e2e.<platform>
# (downloaded by scripts/setup/setup-env-for-e2e), into shell variables that are NOT exported, so
# the agent's process never inherits them. Then deletes the file, so the agent can't read it either.
# The app gets the account through launch arguments only (src/app/system/devTools/useE2EInitialization.ts).
# Usage: source scripts/e2e_credentials.sh <platform>
E2E_EMAIL=""
E2E_PASSWORD=""
_env_file=".env.e2e.$1"
_unquote() {
  local v=$1
  if [[ "$v" =~ ^\"(.*)\"$ ]] || [[ "$v" =~ ^\'(.*)\'$ ]]; then v="${BASH_REMATCH[1]}"; fi
  printf '%s' "$v"
}
if [ -f "$_env_file" ]; then
  while IFS= read -r _line || [ -n "$_line" ]; do
    _line="${_line%$'\r'}"
    [[ "$_line" =~ ^[[:space:]]*E2E_TEST_EMAIL=(.*)$ ]] && E2E_EMAIL=$(_unquote "${BASH_REMATCH[1]}")
    [[ "$_line" =~ ^[[:space:]]*E2E_TEST_PASSWORD=(.*)$ ]] && E2E_PASSWORD=$(_unquote "${BASH_REMATCH[1]}")
  done < "$_env_file"
  rm -f "$_env_file"
fi
unset _line _env_file
if [ -n "${GITHUB_ACTIONS:-}" ]; then
  [ -n "$E2E_EMAIL" ] && echo "::add-mask::$E2E_EMAIL"
  [ -n "$E2E_PASSWORD" ] && echo "::add-mask::$E2E_PASSWORD"
fi
if [ "${LOGGED_IN:-true}" = true ] && { [ -z "$E2E_EMAIL" ] || [ -z "$E2E_PASSWORD" ]; }; then
  echo "::error::The e2e test account is missing from .env.e2e.$1"
  return 1
fi
