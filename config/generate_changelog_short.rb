#!/usr/bin/env ruby

readme = File.read("./CHANGELOG.md")
beta_readme = File.read("./docs/BETA_CHANGELOG.md")

mini_readme = readme.split("\n## ")[0..1].join("\n## ")
generated_changelog = beta_readme + "\n\n-------\n" + mini_readme
# Don't want to break the shell command passing this into pilot
generated_changelog = generated_changelog.gsub('"', "'").gsub('`', "'")
puts generated_changelog
