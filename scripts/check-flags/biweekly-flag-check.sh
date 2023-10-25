#!/bin/bash

# only run the flag check every other week (release weeks)
# https://stackoverflow.com/questions/350047/how-to-instruct-cron-to-execute-a-job-every-second-week

DATENUM=`date +\%s`
RELEASEWEEK=`expr $DATENUM / 604800 \% 2`

if [ $RELEASEWEEK -eq 0 ]
then
  echo "It's a release week!"
  echo "Running flag check"
  bundle exec fastlane check_flags
else
  echo "It's NOT a release week"
  echo "Exiting"
fi