warn("PR is classed as Work in Progress") if pr_title.include? "[WIP]"

if lines_of_code > 50 && !files_modified.include?("CHANGELOG.yml")
  fail("No CHANGELOG changes made")
end

# Stop skipping some manual testing
if lines_of_code > 50 && !pr_title.include?("📱")
   warn("Needs testing on a Phone if change is non-trivial")
end

# Don't let testing shortcuts get into master
fail("fdescribe left in tests") if `grep -r fdescribe Artsy_Tests/`.length
fail("fit left in tests") if `grep -r fit(@ Artsy_Tests/`.length

# Devs shouldn't ship changes to this file
fail("Developer Specific file shouldn't be changed") if files_modified.include?("Artsy/View_Controllers/App_Navigation/ARTopMenuViewController+DeveloperExtras.m")
