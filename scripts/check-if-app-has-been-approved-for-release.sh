#!/usr/bin/env bash
set -euxo pipefail


source ./scripts/source-for-bash-env

bundle exec fastlane check_if_app_is_pending_developer_release
