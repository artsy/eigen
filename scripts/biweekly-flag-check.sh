#!/bin/bash

# only run the flag check every other week (release weeks)
# https://stackoverflow.com/questions/350047/how-to-instruct-cron-to-execute-a-job-every-second-week
expr `date +\%s` / 604800 \% 2 >/dev/null || bundle exec fastlane check-flags

