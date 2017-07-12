# This one runs on Travis CI runnning on a linux box
# There is another in DanDangerfile.circle.rb

# Sometimes its a README fix, or something like that - which isn't relevant for
# including in a CHANGELOG for example
declared_trivial = github.pr_title.include? "#trivial"

# Just to let people know
warn("PR is classed as Work in Progress") if github.pr_title.include? "[WIP]"

# Oi, CHANGELOGs please
fail("No CHANGELOG changes made") if git.lines_of_code > 50 && !git.modified_files.include?("CHANGELOG.yml") && !declared_trivial

# Stop skipping some manual testing
warn("Needs testing on a Phone if change is non-trivial") if git.lines_of_code > 50 && !github.pr_title.include?("📱")

# Don't let testing shortcuts get into master
fail("fdescribe left in tests") if `grep -r fdescribe Artsy_Tests/`.length > 1
# Handle Objective-C and Swift
fail("fit left in tests") if `grep -rI "fit(@" Artsy_Tests/`.length > 1
fail("fit left in tests") if `grep -rI "fit(" Artsy_Tests/`.length > 1

# Devs shouldn't ship changes to this file
["Artsy/View_Controllers/App_Navigation/ARTopMenuViewController+DeveloperExtras.m",
 "Artsy/View_Controllers/App_Navigation/ARTopMenuViewController+SwiftDeveloperExtras.swift",
 "Artsy.xcodeproj/xcshareddata/xcschemes/Artsy.xcscheme"].each do |dev_file|
  fail("Developer Specific file shouldn't be changed") if git.modified_files.include? dev_file
end

# Did you make analytics changes? Well you should also include a change to our analytics spec
made_analytics_changes = git.modified_files.include?("/Artsy/App/ARAppDelegate+Analytics.m")
made_analytics_specs_changes = git.modified_files.include?("/Artsy_Tests/Analytics_Tests/ARAppAnalyticsSpec.m")
if made_analytics_changes
  fail("Analytics changes should have reflected specs changes") if !made_analytics_specs_changes

  # And pay extra attention anyway
  message('Analytics dict changed, double check for ?: `@""` on new entries')
  docs = "https://docs.google.com/spreadsheets/u/1/d/1bLbeOgVFaWzLSjxLOBDNOKs757-zBGoLSM1lIz3OPiI/edit#gid=497747862"
  message("Also, double check the [Analytics Eigen schema](#{docs}) if the changes are non-trivial.")
end

# It's relatively common that we ship a CHANGELOG which isn't valid YAML.
# While it's a bit annoying, having the structure from the YAML is nice.

begin
  readme_yaml = File.read "CHANGELOG.yml"
  readme_data = YAML.load readme_yaml

  # Common error when making a new version
  fail "Upcoming is an array, it should be an object" if readme_data["upcoming"].is_a? Array

  # Tie all releases to a date
  readme_data["releases"].each do |release|
    fail "Release #{release['version']} does not have a date" unless release["date"]
  end

  # Ensure that our version number is consistent with the upcoming version
  upcoming_version = readme_data["upcoming"]["version"]
  plist_contents = File.read "Artsy/App_Resources/Artsy-Info.plist"
  fail("You need to set the App's plist version to #{upcoming_version} - use `make update_bundle_version`") unless plist_contents.include? upcoming_version

rescue StandardError
  # YAML could not be parsed, fail the build.
  fail("CHANGELOG isn't valid YAML")
end

# Ensure that we push the Pods submodule
pods_submodule = `git submodule status --recursive`.lines.first { |l| l.include? "Pods"}
# Depending on your git, sometimes a "-" sneaks in
submodule_sha = pods_submodule.split(" ").first.sub("-", "")
begin
  github.api.commit("artsy/eigen-artefacts", submodule_sha)
rescue StandardError
  # YAML could not be parsed, fail the build.
  url = "https://github.com/artsy/eigen-artefacts/"
  fail("Could not find the commit #{submodule_sha} in [artsy/eigen-artefacts](#{url}). \n\nYou need to `git push` in the Pods dir.")
end
