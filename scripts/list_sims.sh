#!/usr/bin/env bash

list_sims() {
     echo "Available Runtimes:"
     echo "$(echo "${SIMLIST}" | jq -r '.devices | keys[] | select(startswith("com.apple.CoreSimulator.SimRuntime."))')"
     exit 1
 }


SIMS=$(xcrun simctl list devices | tail -n +2)
SIMLIST=$(xcrun simctl list -j)

list_sims