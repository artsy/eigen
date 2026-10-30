#!/usr/bin/env bash
# Refuses to continue unless HEAD is an up-to-date release candidate branch.
# The submission tag is placed on HEAD, so running from anywhere else tags the wrong commit.

source "$(dirname "${BASH_SOURCE[0]}")/colors.sh"

branch=$(git rev-parse --abbrev-ref HEAD)

if [[ ! "$branch" =~ ^rc-v[0-9]+(\.[0-9]+)*(-hotfix)?$ ]]; then
  error "Promote must run from rc-v<version> or rc-v<version>-hotfix (e.g. rc-v9.19.0), you're on: $branch"
  exit 1
fi

git fetch origin "$branch" --quiet

if [[ "$(git rev-parse HEAD)" != "$(git rev-parse "origin/$branch")" ]]; then
  error "Local $branch doesn't match origin/$branch. Pull or push so they match, then re-run."
  exit 1
fi

success "On $branch, in sync with origin."
