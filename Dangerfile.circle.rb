# This one runs on Circle

# It can only run after a CI build has ran. Circle however can be unreliable about hooking up
# the PR ENV vars to a CI run.

# Can't run these rules when you're using something like `bundle exec danger pr [url]`
running_on_ci = ENV["CIRCLE_ARTIFACTS"]
if running_on_ci

  # Use Circle's build artifacts feature to let Danger read the build, and test logs.
  # There's nothing fancy here, just a unix command chain with `tee` sending the output to a known file.
  #
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
