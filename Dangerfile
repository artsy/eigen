if pr_title.include? "[WIP]"
  warn "PR is classed as Work in Progress"
end

unless files_modified.include? "CHANGELOG.yml"
  fail "No CHANGELOG changes made"
end
