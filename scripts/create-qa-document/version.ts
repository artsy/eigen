// Parse the release version out of an RC branch name.
//   "rc-v9.12.0" -> "9.12.0"
// The QA document flow is triggered by the RC pull request, whose head branch
// already encodes the target version, so we read it straight from there.
export const getVersionFromBranch = (branch: string): string => {
  const match = branch.match(/^rc-v(\d+(?:\.\d+)*)$/)
  if (!match) {
    throw new Error(`Expected an "rc-v<version>" branch, got: "${branch}"`)
  }
  return match[1]
}
