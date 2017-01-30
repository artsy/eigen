import { danger, fail, warn } from 'danger'
import { includes } from 'lodash'

// CHANGELOG check
const modifiedAppFiles = danger.git.modified_files.filter(path => path.includes('lib/'))
const changelogChanges = danger.git.modified_files.includes('CHANGELOG.md')

if (modifiedAppFiles.length > 0 && !changelogChanges) {
  fail('No CHANGELOG added.')
}

if (!danger.github.pr.body.length) {
  fail('Please add a description to your PR.')
}

// Warns if there are changes to package.json without changes to yarn.lock.
const packageChanged = includes(danger.git.modified_files, 'package.json')
const lockfileChanged = includes(danger.git.modified_files, 'yarn.lock')
if (packageChanged && !lockfileChanged) {
  const message = 'Changes were made to package.json, but not to yarn.lock'
  const idea = 'Perhaps you need to run `yarn install`?'
  warn(`${message} - <i>${idea}</i>`)
}

const someoneAssigned = danger.github.pr.assignee
if (someoneAssigned === null) {
  fail('Please assign someone to merge this PR, and optionally include people who should review.')
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
