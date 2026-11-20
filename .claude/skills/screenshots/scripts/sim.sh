#!/bin/bash
# Drive the Artsy dev app on Android (adb) or iOS (simctl + agent-device) the same way.
#
# usage: sim.sh <command> [android|ios] [args...]
#   check    [android|ios]                check Metro and required tools (both platforms if omitted)
#   devices                               list connected emulators / booted simulators
#   shot     <platform> <out.png>         screenshot
#   open     <platform> <path>            open artsy://<path>
#   tap      <platform> <x> <y>           tap
#   swipe    <platform> <x1> <y1> <x2> <y2>  slow swipe
#   back     android                      hardware back
#   restart  <platform>                   relaunch the app with fresh JS state
#   close    ios                          end the agent-device session and release the simulator
#   compare  <before.png> <after.png> <out.png>  labelled side-by-side
#
# With several Android devices connected, set ANDROID_SERIAL first.
# With several iOS simulators booted, set IOS_UDID first.

set -euo pipefail

ANDROID_PKG="net.artsy.app"
IOS_BUNDLE="net.artsy.artsy"

cmd="${1:-}"
platform="${2:-}"

# Every iOS command targets one explicit UDID, so taps never land on another booted simulator
ios_udid() {
  local udid="${IOS_UDID:-$(xcrun simctl list devices booted | grep -oE '[0-9A-F-]{36}' | head -1)}"
  [ -n "$udid" ] || echo "no booted iOS simulator (boot one, or set IOS_UDID)" >&2
  echo "$udid"
}

# agent-device only taps inside a session, so open one on first use. open doesn't relaunch the app,
# so the current screen is kept.
ios_ad() {
  local sel=(--platform ios --udid "$(ios_udid)" --session screenshots)
  if ! agent-device session list 2>/dev/null | grep -q '"name": "screenshots"'; then
    agent-device open "$IOS_BUNDLE" "${sel[@]}" >/dev/null
  fi
  agent-device "$@" "${sel[@]}" >/dev/null
}

case "$cmd" in
  check)
    # Report everything missing at once, with how to install it; never install anything
    missing=0
    need() { command -v "$1" >/dev/null || { echo "missing: $1 ($2)"; missing=1; }; }
    curl -s --max-time 2 http://localhost:8081/status | grep -q packager-status:running \
      || { echo "missing: Metro on :8081 (run: yarn start)"; missing=1; }
    need magick "brew install imagemagick"
    if [ "$platform" != ios ]; then need adb "install Android Studio platform-tools"; fi
    if [ "$platform" != android ]; then
      need xcrun "install Xcode"
      need agent-device "npm install -g agent-device"
    fi
    [ "$missing" = 0 ] && echo "all requirements met"
    exit "$missing"
    ;;
  devices)
    adb devices | tail -n +2 | grep -w device || echo "no android devices"
    xcrun simctl list devices booted | grep Booted || echo "no booted ios simulators"
    ;;
  shot)
    if [ "$platform" = android ]; then adb exec-out screencap -p > "$3"
    else xcrun simctl io "$(ios_udid)" screenshot "$3" >/dev/null; fi
    ;;
  open)
    if [ "$platform" = android ]; then
      # am start exits 0 even when the intent fails, so check its output.
      # adb shell re-parses the command on the device, so quote the URL again or `&` cuts it short
      out=$(adb shell am start -a android.intent.action.VIEW -d "'artsy://${3#/}'" "$ANDROID_PKG" 2>&1)
      if echo "$out" | grep -q Error; then echo "$out" >&2; exit 1; fi
    else xcrun simctl openurl "$(ios_udid)" "artsy://${3#/}"; fi
    ;;
  tap)
    if [ "$platform" = android ]; then adb shell input tap "$3" "$4"
    else ios_ad press "$3" "$4"; fi
    ;;
  swipe)
    if [ "$platform" = android ]; then adb shell input swipe "$3" "$4" "$5" "$6" 800
    else ios_ad gesture pan "$3" "$4" "$(($5 - $3))" "$(($6 - $4))" 800; fi
    ;;
  back)
    adb shell input keyevent BACK
    ;;
  restart)
    if [ "$platform" = android ]; then
      adb shell am force-stop "$ANDROID_PKG"
      adb shell monkey -p "$ANDROID_PKG" -c android.intent.category.LAUNCHER 1 >/dev/null 2>&1
    else
      xcrun simctl terminate "$(ios_udid)" "$IOS_BUNDLE" 2>/dev/null || true
      xcrun simctl launch "$(ios_udid)" "$IOS_BUNDLE" >/dev/null
    fi
    ;;
  close)
    agent-device close --session screenshots >/dev/null 2>&1 || true
    ;;
  compare)
    font=/System/Library/Fonts/Helvetica.ttc
    magick \
      \( "$2" -resize 540x -gravity North -background white -splice 0x60 -font "$font" -pointsize 36 -annotate +0+10 Before \) \
      \( "$3" -resize 540x -gravity North -background white -splice 0x60 -font "$font" -pointsize 36 -annotate +0+10 After \) \
      -bordercolor white -border 10 +append "$4"
    ;;
  *)
    sed -n '2,16p' "$0"; exit 1
    ;;
esac
