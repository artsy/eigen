#!/usr/bin/env bash
# Runs inside android-emulator-runner once the emulator is up: checks that
# blocked hosts are unreachable, applies the persona's phone settings,
# installs the app and hands the emulator to Claude Code. The agent's output
# goes to results/ (encrypted later), never to the public log.
# Eigen fork of upstream scripts/android/run_agent.sh: launches the QA app with the e2e launch
# arguments (signed in or out, no push prompt or popovers) instead of `monkey`.
set -uo pipefail
adb wait-for-device
mkdir -p "results/$PERSONA"
# 1. Blocked hosts must not resolve to a real IP from inside the emulator
for h in $BLOCK_HOSTS; do
  ip=$(adb shell ping -c 1 -W 2 "$h" 2>&1 | head -1 | grep -oE '\(([0-9]{1,3}\.){3}[0-9]{1,3}\)' | tr -d '()')
  case "$ip" in ""|0.0.0.0|127.*) ;; *) echo "$h reachable from the emulator ($ip): aborting"; exit 1 ;; esac
done
# 2. Phone language (the emulator boots in en-US; google_apis images allow adb root)
if [ "$(adb shell getprop persist.sys.locale | tr -d '\r')" != "$LOCALE" ]; then
  adb root >/dev/null 2>&1; sleep 3; adb wait-for-device
  adb shell "setprop persist.sys.locale $LOCALE; setprop ctl.restart zygote"; sleep 10; adb wait-for-device
  for i in $(seq 1 60); do [ "$(adb shell getprop sys.boot_completed | tr -d '\r')" = 1 ] && break; sleep 3; done
fi
# 3. App + persona settings
adb install -r -g app.apk || adb install -r app.apk
adb shell settings put system font_scale "${FONT_SCALE:-1.0}"
[ "${THEME:-light}" = dark ] && adb shell cmd uimode night yes
adb emu geo fix "${GEO#*,}" "${GEO%,*}" >/dev/null 2>&1   # longitude first

# Eigen: first launch with the e2e launch arguments. The credentials exist only in this shell.
# Values are single-quoted for the device shell that `adb shell` hands them to.
q() { printf "'%s'" "$(printf '%s' "$1" | sed "s/'/'\\\\''/g")"; }
source scripts/e2e_credentials.sh android || exit 1
ARGS=(--es useE2EInit true)
if [ "${LOGGED_IN:-true}" = true ]; then ARGS+=(--es email "$(q "$E2E_EMAIL")" --es password "$(q "$E2E_PASSWORD")"); else ARGS+=(--es shouldSignOut true); fi
[ -n "${FEATURE_FLAGS:-}" ] && ARGS+=(--es enableFeatureFlags "$(q "$FEATURE_FLAGS")")
adb shell am force-stop "$APP_ID"
adb shell am start -W -n "$APP_ID/.MainActivity" "${ARGS[@]}" >/dev/null
unset ARGS E2E_EMAIL E2E_PASSWORD
adb logcat -c; sleep 15   # hydration + sign-in

# 4. Optional screen recording, kept in results/ (encrypted like the rest)
REC=""
if [ "${RECORD_VIDEO:-false}" = true ]; then
  adb shell settings put system show_touches 1
  SZ=$(adb shell wm size | grep -oE '[0-9]+x[0-9]+' | tail -1); W=${SZ%x*}; H=${SZ#*x}
  RW=$((W * 2 / 3 / 16 * 16)); RH=$((H * RW / W / 16 * 16))
  rm -f /tmp/stop-rec
  ( i=0; opt="--size ${RW}x${RH}"
    while [ ! -f /tmp/stop-rec ] && [ $i -lt 40 ]; do
      i=$((i + 1)); t0=$(date +%s)
      adb shell screenrecord $opt --bit-rate 4000000 --time-limit 180 "/sdcard/rec_$(printf %02d $i).mp4"
      [ $(($(date +%s) - t0)) -lt 3 ] && opt=""
    done ) &
  REC=$!
fi
# 5. The agent: only the listed tools, nothing else
LOGIN_STATE=$([ "${LOGGED_IN:-true}" = true ] && echo "already signed in to a test account" || echo "signed out (a new user)")
claude -p "Read $BRIEF and personas.json, then do the mission until the final report. PERSONA=$PERSONA PLATFORM=android APP_ID=$APP_ID. Device: ${DEVICE}, font scale x${FONT_SCALE:-1.0}, theme ${THEME:-light}, language $LOCALE. The app is $LOGIN_STATE. Report anything that does not fit this screen (cut text, off-screen buttons, broken layout)." \
  --model "${MODEL:-sonnet}" --max-turns 400 --output-format json \
  --allowedTools "Bash(adb:*),Bash(python3 scripts/android/screen.py:*),Bash(python3 scripts/android/type.py:*),Bash(sleep:*),Bash(ls:*),Bash(mkdir:*),Read,Write,Edit" \
  > results/agent-output.json 2> results/agent-errors.txt
CODE=$?
python3 scripts/agent_status.py results/agent-output.json results/agent-errors.txt "$PERSONA" || true
if [ -n "$REC" ]; then
  touch /tmp/stop-rec; adb shell pkill -INT screenrecord; sleep 4; kill "$REC" 2>/dev/null
  mkdir -p "results/$PERSONA/video"
  for f in $(adb shell ls /sdcard/ | tr -d '\r' | grep '^rec_'); do adb pull "/sdcard/$f" "results/$PERSONA/video/" >/dev/null 2>&1; done
fi
echo "Agent finished (exit $CODE), $(ls "results/$PERSONA" | wc -l) files"
