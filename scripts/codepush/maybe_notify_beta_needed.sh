#!/bin/bash
set -euxo pipefail

S3_TIMESTAMP_PATH="s3://artsy-citadel/eigen/last-notified.txt"

# Attempt to fetch the last notification timestamp
aws s3 cp $S3_TIMESTAMP_PATH ./last-notified.txt > /dev/null || echo "No previous timestamp found." >&2

if [ -f ./last-notified.txt ]; then
  last_notified=$(cat ./last-notified.txt)
else
  last_notified=0
fi

current_time=$(date +%s)  # Current time in seconds since 1970-01-01
time_difference=$((current_time - last_notified))

# Check if 24 hours (86400 seconds) have passed since the last notification
if [ $time_difference -ge 86400 ]; then
  # bundle exec fastlane notify_beta_needed

  # Update the timestamp
  echo $current_time | aws s3 cp - $S3_TIMESTAMP_PATH
fi
