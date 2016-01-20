warn("PR is classed as Work in Progress") if pr_title.include? "[WIP]"

if lines_of_code > 50 && !files_modified.include?("CHANGELOG.yml")
  fail("No CHANGELOG changes made")
end

# Stop skipping some manual testing
if lines_of_code > 50 && !pr_title.include?("📱")
   warn("Needs testing on a Phone if change is non-trivial")
end

message "LOC: #{lines_of_code}"
message "Mod: #{files_modified}"
message "Added: #{files_added}"
message "Added: #{files_removed}"
