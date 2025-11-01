#!/usr/bin/env bash
set -e

root="${PWD}"

# Package name and current version
package_name="$1"
version=$(yarn why "${package_name}" | grep -o "${package_name}@npm:[^\[]*" | cut -d ":" -f2)

# Create temporary folder
rm -rf "${root}/tmp"
mkdir "${root}/tmp"
cd "${root}/tmp"

# Creates an empty npm project, install package and copy changes
npm init -y
npm i "${package_name}@${version}"
cp -a "${root}/node_modules/${package_name}/." "./node_modules/${package_name}/"

# Creates the patch, moves it to main project and clean up
npx patch-package "${package_name}"
cp -a ./patches/. "${root}/patches/"
rm -rf "${root}/tmp"