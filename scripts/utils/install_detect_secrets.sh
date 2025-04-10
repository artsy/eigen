#!/bin/bash

[ ! -f "$HOME/.default-python-packages" ] && touch "$HOME/.default-python-packages"

# Array of pip packages to be added
pip_packages=("virtualenv" "pre-commit" "detect-secrets==1.5.0")
for package in "${pip_packages[@]}"; do
  if ! grep -q "$package" "$HOME/.default-python-packages"; then
    echo "$package" >> "$HOME/.default-python-packages"
  fi
done

echo "legacy_version_file = yes" >> "$HOME/.asdfrc"
if asdf plugin add --help &>/dev/null; then
  asdf plugin add python
else
  asdf plugin-add python
fi
asdf install python latest

if asdf set --help &>/dev/null; then
  # Newer asdf version
  asdf set python latest --home
else
  # Older asdf version
  asdf global python latest
fi