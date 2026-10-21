#!/bin/bash
# Drive the Artsy dev app on Android (adb) or iOS (simctl + idb) the same way.
#
# usage: sim.sh <command> [android|ios] [args...]
#   devices                               list connected emulators / booted simulators
#   shot     <platform> <out.png>         screenshot
#   open     <platform> <path>            open artsy://<path>
#   tap      <platform> <x> <y>           tap
#   swipe    <platform> <x1> <y1> <x2> <y2>  slow swipe
#   back     android                      hardware back
#   restart  <platform>                   relaunch the app with fresh JS state
#   compare  <before.png> <after.png> <out.png>  labelled side-by-side
#
# With several Android devices connected, set ANDROID_SERIAL first.

set -euo pipefail

ANDROID_PKG="net.artsy.app"
IOS_BUNDLE="net.artsy.artsy"

cmd="${1:-}"
platform="${2:-}"

# idb has no default target unless a companion is connected, so always pass the booted simulator
ios_udid() { xcrun simctl list devices booted | grep -oE '[0-9A-F-]{36}' | head -1; }

case "$cmd" in
  devices)
    adb devices | tail -n +2 | grep -w device || echo "no android devices"
    xcrun simctl list devices booted | grep Booted || echo "no booted ios simulators"
    ;;
  shot)
    if [ "$platform" = android ]; then adb exec-out screencap -p > "$3"
    else xcrun simctl io booted screenshot "$3" >/dev/null 2>&1; fi
    ;;
  open)
    if [ "$platform" = android ]; then adb shell am start -a android.intent.action.VIEW -d "artsy://${3#/}" "$ANDROID_PKG" >/dev/null 2>&1
    else xcrun simctl openurl booted "artsy://${3#/}"; fi
    ;;
  tap)
    if [ "$platform" = android ]; then adb shell input tap "$3" "$4"
    else idb ui tap --udid "$(ios_udid)" "$3" "$4"; fi
    ;;
  swipe)
    if [ "$platform" = android ]; then adb shell input swipe "$3" "$4" "$5" "$6" 800
    else idb ui swipe --udid "$(ios_udid)" --duration 0.8 "$3" "$4" "$5" "$6"; fi
    ;;
  back)
    adb shell input keyevent BACK
    ;;
  restart)
    if [ "$platform" = android ]; then
      adb shell am force-stop "$ANDROID_PKG"
      adb shell monkey -p "$ANDROID_PKG" -c android.intent.category.LAUNCHER 1 >/dev/null 2>&1
    else
      xcrun simctl terminate booted "$IOS_BUNDLE" 2>/dev/null || true
      xcrun simctl launch booted "$IOS_BUNDLE" >/dev/null
    fi
    ;;
  compare)
    font=/System/Library/Fonts/Helvetica.ttc
    magick \
      \( "$2" -resize 540x -gravity North -background white -splice 0x60 -font "$font" -pointsize 36 -annotate +0+10 Before \) \
      \( "$3" -resize 540x -gravity North -background white -splice 0x60 -font "$font" -pointsize 36 -annotate +0+10 After \) \
      -bordercolor white -border 10 +append "$4"
    ;;
  *)
    sed -n '2,14p' "$0"; exit 1
    ;;
esac
