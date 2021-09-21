# Useful script to convert images from pngs to webps for bundle size reduction

for f in *.png; do
  echo "Converting $f"
  ff=${f%????}
  echo "no ext ${ff}"
  cwebp -q 75 -m 6 "$(pwd)/${f}" -o "${ff}.webp"
done