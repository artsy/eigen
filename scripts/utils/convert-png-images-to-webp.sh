#!/usr/bin/env bash
set -euxo pipefail

# Converts images from pngs to webps for bundle size reduction
# it will be run for all png images in the `/images` directory

for f in "images/"*.png; do
  echo "Converting $f"
  ff=${f%????}
  echo "no ext ${ff}"

  cwebp -q 75 -m 6 "$(pwd)/${f}" -o "${ff}.webp"

  echo "Deleting the png: ${f}"
  rm -rf "$(pwd)/${f}"
done
