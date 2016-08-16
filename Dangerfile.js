// CHANGELOG check
if (_.includes(git.modified_files, "CHANGELOG.md") === false) {
  fail("No CHANGELOG added.")
}

// Modifed files from inside Emission itself
const modified_app_paths = _.filter(git.modified_files, function(path) {
  return _.includes(path, "lib/") && _.includes(path, ".js") && !_.includes(path, "__tests__")
})

// Looking for corresponding `__tests__`
function hasCorrelatedTestChange(filename) {
    return _.find(git.modified_files, function(modified_path) {
      return _.endsWith(modified_path, filename.replace(".js", "-tests.js"))
    } ) != null
}

// Check to see whether there's a test change for every modified emission file
const app_code_without_tests = _.reject(modified_app_paths, function(path){
  var filename = path.split("/").pop()
  return hasCorrelatedTestChange(filename)
})

// Check that any new file has a corresponding tests file
if (app_code_without_tests.length > 0) {
  fail("The following files do not have tests: " + github.html_link(app_code_without_tests))
}
