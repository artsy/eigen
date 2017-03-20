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
    message('Also, double check the [Analytics Eigen schema](https://docs.google.com/spreadsheets/u/1/d/1bLbeOgVFaWzLSjxLOBDNOKs757-zBGoLSM1lIz3OPiI/edit#gid=497747862) if the changes are non-trivial.')
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

  current_sticker_version = `/usr/libexec/PlistBuddy -c "Print CFBundleShortVersionString" Artsy\ Stickers/Info.plist`.strip
  fail("You need to set the Sticker extensions's plist version to #{upcoming_version}") if current_sticker_version != upcoming_version

rescue StandardError
  # YAML could not be parsed, fail the build.
  fail("CHANGELOG isn't valid YAML")
end

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


# IMO, this is a nice idea, but we're getting no value
# from it now that we're doing more react-native.

# # We want to understand how much Swift is slowing our compilation cycles by, so look at the top 1000 Swift symbols from the build log 
# most_expensive_swift_table = `cat #{build_file} | egrep '\.[0-9]ms' | sort -t "." -k 1 -n | tail -1000 | sort -t "." -k 1 -n -r`

# # each line looks like "29.2ms  /Users/distiller/eigen/Artsy/View_Controllers/Live_Auctions/LiveAuctionLotViewController.swift:50:19    @objc override func viewDidLoad()"
# # Looks for outliers based on http://stackoverflow.com/questions/5892408/inferential-statistics-in-ruby/5892661#5892661
# time_values = most_expensive_swift_table.lines.map { |line| line.split.first.to_i }.reject { |value| value == 0 }

# require_relative "config/enumerable_stats"
# outliers = time_values.outliers(3)

# # Take any build timing outliers, and convert them into a useful markdown table.
# if outliers.any?
#   warn("Detected some Swift building time outliers")

#   current_branch = env.request_source.pr_json["head"]["ref"]
#   headings = "Time | Class | Function |\n| --- | ----- | ----- |"
#   warnings = most_expensive_swift_table.lines[0...outliers.count].map do |line|
#     time, location, function_name = line.split "\t"
#     github_loc = location.gsub("/Users/distiller/eigen", "/artsy/eigen/tree/#{current_branch}")
#     github_loc_code = github_loc.split(":")[0...-1].join("#L")
#     name = File.basename(location).split(":").first
#     "#{time} | [#{name}](#{github_loc_code}) | #{function_name}"
#   end

#   markdown(([headings] + warnings).join)
# end

# # Give inline test fail reports
# results_file = File.join(ENV["CIRCLE_TEST_REPORTS"], "/xcode/results.xml")
# junit.parse results_file
# junit.report


# Make submodule changes clickable
