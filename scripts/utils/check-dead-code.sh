#!/bin/bash

npx ts-prune --project tsconfig.json \
  | grep -v '(used in module)' \
  | grep -v '__generated__' \
  | grep -v 'palette' \
  | grep -v '__mocks__'
