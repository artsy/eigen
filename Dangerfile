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
  current_version = `/usr/libexec/PlistBuddy -c "Print CFBundleShortVersionString" Artsy/App_Resources/Artsy-Info.plist`.strip
  fail("You need to set the App's plist version to #{upcoming_version}") if current_version != upcoming_version

  current_sticker_version = `/usr/libexec/PlistBuddy -c "Print CFBundleShortVersionString" "Artsy Stickers/Info.plist"`.strip
  fail("You need to set the Sticker extensions's plist version to #{upcoming_version}") if current_sticker_version != upcoming_version

rescue StandardError
  # YAML could not be parsed, fail the build.
  fail("CHANGELOG isn't valid YAML")
end

# Can't run these rules when you're using something like `bundle exec danger pr [url]`
running_on_ci = ENV["CIRCLE_ARTIFACTS"]
if running_on_ci

  # Use Circle's build artifacts feature to let Danger read the build, and test logs.
  # There's nothing fancy here, just a unix command chain with `tee` sending the output to a known file.
  #
  build_file = File.join(ENV["CIRCLE_ARTIFACTS"], "xcode_build_raw.log")
  test_file = File.join(ENV["CIRCLE_ARTIFACTS"], "xcode_test_raw.log")

  # If there's snapshot fails, we should also fail danger, but we can make the thing clickable in a comment instead of hidden in the log
  # Note: this _may_ break in a future build of Danger, I am debating sandboxing the runner from ENV vars.
  test_log = File.read test_file
  snapshots_url = test_log.match(%r{https://eigen-ci.s3.amazonaws.com/\d+/index.html})
  fail("There were [snapshot errors](#{snapshots_url})") if snapshots_url

  # Look for unstubbed networking requests in the build log, as these can be a source of test flakiness.
  unstubbed_regex = /   Inside Test: -\[(\w+) (\w+)/m
  if test_log.match(unstubbed_regex)
    output = "#### Found unstubbed networking requests\n"
    test_log.scan(unstubbed_regex).each do |class_and_test|
      class_name = class_and_test[0]
      url = "https://github.com/search?q=#{class_name.gsub("Spec", "")}+repo%3Aartsy%2Feigen&ref=searchresults&type=Code&utf8=✓"
      output += "\n* [#{class_name}](#{url}) in `#{class_and_test[1]}`"
    end
    warn(output)
  end
end

# Ensure that we push the Pods submodule
pods_submodule = `git submodule status --recursive`.lines.first { |l| l.include? "Pods"}
submodule_sha = pods_submodule.split(" ").first
begin
  client.commit("artsy/eigen-artefacts", submodule_sha)
rescue StandardError
  # YAML could not be parsed, fail the build.
  url = "https://github.com/artsy/eigen-artefacts/"
  fail("Could not find the commit #{submodule_sha} in [artsy/eigen-artefacts](#{url}). </br>You need to `git push` in the Pods dir.")
end
