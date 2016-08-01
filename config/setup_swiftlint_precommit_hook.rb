#!/usr/bin/env ruby

PRECOMMIT_HOOK_FILENAME = '.git/hooks/pre-commit'
PRECOMMIT_HOOK = <<-EOS
# Modified from https://github.com/realm/SwiftLint/issues/413#issuecomment-184077062
run_swiftlint() {
    local filename="${1}"
    if [[ "${filename##*.}" == "swift" ]]; then
      # Tests and prod code have different configs, use the proper one.
      if [[ $filename == Artsy_Tests* ]]; then
        swiftlint lint --quiet --config Artsy_Tests/.swiftlint.yml --path "${filename}"
      else
        swiftlint lint --quiet --config Artsy/.swiftlint.yml --path "${filename}"
      fi
    fi
}

if which swiftlint >/dev/null; then
  echo "SwiftLint version: $(swiftlint version)"
  git diff --name-only | while read filename; do run_swiftlint "${filename}"; done
  git diff --cached --name-only | while read filename; do run_swiftlint "${filename}"; done
else
  echo "warning: SwiftLint not installed, download from https://github.com/realm/SwiftLint"
fi

EOS

def write_precommit_hook
  File.open(PRECOMMIT_HOOK_FILENAME, 'a') { |file| file.write(PRECOMMIT_HOOK) }
end

def precommit_hook_exists?
  return false unless File.exists? PRECOMMIT_HOOK_FILENAME
  precommit_hook_contents = File.read PRECOMMIT_HOOK_FILENAME
  return precommit_hook_contents.include? PRECOMMIT_HOOK
end

write_precommit_hook unless precommit_hook_exists?