#!/bin/bash

TEST_FILES=$(find e2e/flows -name "*.yml" | sort | awk "NR % ${CIRCLE_NODE_TOTAL} == ${CIRCLE_NODE_INDEX}")

EXIT_CODE=0

for TEST_FILE in $TEST_FILES; do
  echo "Running test: $TEST_FILE"
  maestro test "$TEST_FILE" @.env.maestro
  if [ $? -ne 0 ]; then
    EXIT_CODE=1
  fi
done

echo "Final Exit Code: $EXIT_CODE"
exit $EXIT_CODE