// CHANGELOG check
if (_.includes(git.modified_files, "CHANGELOG.md") === false) {
  fail("No CHANGELOG added.")
}

const test_files = _.filter(git.modified_files, function(path){
  return _.includes(path, '__tests__/');
})

const logical_test_paths = _.map(test_files, function(path){
  // turns "lib/__tests__/i-am-good-tests.js" into "lib/i-am-good.js"
  return path.replace(/__tests__\//, '').replace(/-tests\./, '.')
})

const source_paths = _.filter(git.modified_files, function(path){
  return _.includes(path, 'lib/') &&  !_.includes(path, '__tests__/');
})

// Check that any new file has a corresponding tests file
const untested_files = _.difference(source_paths, logical_test_paths)
if (untested_files.length > 0) {
  warn("The following files do not have tests: " + github.html_link(untested_files))
}
