#!/usr/bin/env ruby

PRECOMMIT_HOOK_FILENAME = '.git/hooks/pre-commit'
PRECOMMIT_HOOK = <<-EOS
if which swiftlint >/dev/null; then
  swiftlint lint --quiet --config Artsy/.swiftlint.yml
  swiftlint lint --quiet --config Artsy_Tests/.swiftlint.yml 
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