

#!/bin/bash
set -euo pipefail

# Send a push notification to iOS simulator

# Check if push path is provided
if [ $# -eq 0 ]; then
  echo "Usage: $0 <PUSH_PATH>"
  echo "Example: $0 ~/some/path/to/your-push.apns"
  exit 1
fi

PUSH_PATH="$1"
xcrun simctl push booted net.artsy.artsy "$PUSH_PATH";