#!/bin/bash

# This script runs performance tests using Flashlight and Maestro.
# It generates two files:
# 1. A JSON file with performance results, named with a timestamp (e.g., flashlight_results_2025-09-23_15-42-10.json).
# 2. A video recording of the test run, saved in the current directory (e.g ., flashlight_recording_2025-09-23_15-42-10_iteration_01758644695384.mp4).
# You can see the performance results by running after you run the test the following:
# flashlight report flashlight_results_2025-09-23_15-42-10.json

# Or if you want to compare between two runs:
# flashlight report flashlight_results_2025-09-22_14-30-05.json flashlight_results_2025-09-23_15-42-10.json

# Generate timestamp (e.g., 2025-09-23_15-42-10)
timestamp=$(date +"%Y-%m-%d_%H:%M:%S")

# Note that this is only supported on android devices or emulators at the moment.
flashlight test --bundleId net.artsy.app \
  --testCommand "maestro test e2e/perf/perf-test-home.yml" \
  --duration 10000 \
  --iterationCount 1 \
  --skipRestart \
  --record \
  --resultsFilePath "flashlight_results_$timestamp.json" \
  --resultsTitle "Results"
