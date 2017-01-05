/* @flow */

import { danger, fail } from 'danger'

// CHANGELOG check
const modifiedAppFiles = danger.git.modified_files.filter(path => path.includes('lib/'))
const changelogChanges = danger.git.modified_files.includes('CHANGELOG.md')

if (modifiedAppFiles.length > 0 && !changelogChanges) {
  fail('No CHANGELOG added.')
}

// Danger JS doesn't support warn yet.

//  const testFiles = _.filter(git.modified_files, function(path) {
//    return _.includes(path, '__tests__/');
//  })
//
//  const logicalTestPaths = _.map(testFiles, function(path) {
//    // turns "lib/__tests__/i-am-good-tests.js" into "lib/i-am-good.js"
//    return path.replace(/__tests__\//, '').replace(/-tests\./, '.')
//  })
//
//  const sourcePaths = _.filter(git.modified_files, function(path) {
//    return _.includes(path, 'lib/') &&  !_.includes(path, '__tests__/');
//  })
//
//  // Check that any new file has a corresponding tests file
//  const untestedFiles = _.difference(sourcePaths, logicalTestPaths)
//  if (untestedFiles.length > 0) {
//    warn("The following files do not have tests: " + github.html_link//(untestedFiles))
//  }
