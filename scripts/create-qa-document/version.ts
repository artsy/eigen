// Parse the release version out of an RC branch name.
//   "rc-v9.12.0"        -> "9.12.0"
//   "rc-v9.12.1-hotfix" -> "9.12.1"
// The QA document flow is triggered by the RC pull request, whose head branch
// already encodes the target version, so we read it straight from there.
const RC_BRANCH_REGEX = /^rc-v(\d+(?:\.\d+)*)(-hotfix)?$/

export const getVersionFromBranch = (branch: string): string => {
  const match = branch.match(RC_BRANCH_REGEX)
  if (!match) {
    throw new Error(
      `Expected an "rc-v<version>" or "rc-v<version>-hotfix" branch, got: "${branch}"`
    )
  }
  return match[1]
}

export const isHotfixBranch = (branch: string): boolean => {
  return RC_BRANCH_REGEX.exec(branch)?.[2] !== undefined
}
