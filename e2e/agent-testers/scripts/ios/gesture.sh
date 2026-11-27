#!/usr/bin/env bash
# Gestures on the iOS simulator, positions in POINTS (as read on screen.py images).
#   gesture.sh tap X Y | long-press X Y | swipe X1 Y1 X2 Y2 | scroll down|up
#   gesture.sh back (left-edge swipe) | dismiss-sheet | enter | home | open | relaunch | url URL
set -euo pipefail
: "${UDID:?UDID missing}" "${APP_ID:?APP_ID missing}"
size() {
  W=$(cat "${RUNNER_TEMP:-/tmp}/width_points" 2>/dev/null || echo 390)
  H=$(python3 -c "import glob,os;from PIL import Image
f=sorted(glob.glob('results/**/*.png',recursive=True),key=os.path.getmtime)
print(Image.open(f[-1]).size[1] if f else 844)" 2>/dev/null || echo 844)
}
case "${1:-}" in
  tap) axe tap -x "$2" -y "$3" --udid "$UDID" ;;
  long-press) axe touch -x "$2" -y "$3" --down --up --delay 1 --udid "$UDID" ;;
  swipe) axe swipe --start-x "$2" --start-y "$3" --end-x "$4" --end-y "$5" --duration 0.5 --udid "$UDID" ;;
  scroll) size; x=$((W / 2))
    if [ "${2:-down}" = down ]; then axe swipe --start-x $x --start-y $((H * 3 / 4)) --end-x $x --end-y $((H / 4)) --duration 0.5 --udid "$UDID"
    else axe swipe --start-x $x --start-y $((H / 4)) --end-x $x --end-y $((H * 3 / 4)) --duration 0.5 --udid "$UDID"; fi ;;
  back) size; axe gesture swipe-from-left-edge --screen-width "$W" --screen-height "$H" --udid "$UDID" ;;
  dismiss-sheet) size; axe swipe --start-x $((W / 2)) --start-y $((H / 6)) --end-x $((W / 2)) --end-y $((H * 5 / 6)) --duration 0.6 --udid "$UDID" ;;
  enter) axe key 40 --udid "$UDID" ;;
  home) axe button home --udid "$UDID" ;;
  # Eigen: -useE2EInit keeps push prompts and onboarding popovers hidden. The session is already
  # stored in the app, so no credentials are needed here (and the agent never sees them).
  open) xcrun simctl launch "$UDID" "$APP_ID" -useE2EInit true >/dev/null ;;
  relaunch) xcrun simctl terminate "$UDID" "$APP_ID" >/dev/null 2>&1 || true; sleep 1; xcrun simctl launch "$UDID" "$APP_ID" -useE2EInit true >/dev/null; sleep 5 ;;
  url) xcrun simctl openurl "$UDID" "$2" ;;
  *) echo "unknown gesture: ${1:-}"; exit 2 ;;
esac
sleep 1
echo "done: $*"
