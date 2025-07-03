echo "📱 Selecting iPhone 16 Pro simulator with iOS 18.2..."

SIMULATOR_UDID=$(xcrun simctl list devices -j | jq -r '
  .devices["com.apple.CoreSimulator.SimRuntime.iOS-18-2"][]
  | select(.name == "iPhone 16 Pro" and .isAvailable == true)
  | .udid' | head -n 1)

if [ -z "$SIMULATOR_UDID" ]; then
  echo "❌ Failed to find matching simulator."
  exit 1
fi

echo "$SIMULATOR_UDID"
