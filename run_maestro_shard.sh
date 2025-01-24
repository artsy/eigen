#!/bin/bash

TEST_FILES=$(find e2e -name "*.yml" | sort | awk "NR % ${CIRCLE_NODE_TOTAL} == ${CIRCLE_NODE_INDEX}")

EXIT_CODE=0
echo "$TEST_FILES" | xargs -n 1 -I {} bash -c "maestro test {} || EXIT_CODE=$?"
echo "Final Exit Code: $EXIT_CODE"
exit $EXIT_CODE