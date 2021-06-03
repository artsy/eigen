import { getChangeLog, isMergedAfter } from "./parseGitLog"

describe("isMergedAfter", () => {
  it("returns false when the PR has not been merged (merged_at is null)", () => {
    expect(isMergedAfter(null, new Date("01 June 2021"))).toEqual(false)
  })

  it("returns false when the PR has not been merged before the release commit date", () => {
    expect(isMergedAfter("01 June 2021 ", new Date("02 June 2021"))).toEqual(false)
  })

  it("returns false when the PR has been merged after the release commit date ", () => {
    expect(isMergedAfter("02 June 2021 ", new Date("01 June 2021"))).toEqual(true)
  })
})

describe("getChangeLog", () => {
  it("gets the combined changelog from all prs", () => {
    expect(getChangeLog(prs as any)).toEqual({
      androidUserFacingChanges: [],
      crossPlatformUserFacingChanges: ["Added a new button", "Added an other button", "Fixed modal close button"],
      devChanges: ["Improved changelog tooling", "Upgraded lodash"],
      iOSUserFacingChanges: ["fixed button on iOS"],
    })
  })
  it("returns nothing when nothing changed", () => {
    expect(getChangeLog([] as any)).toEqual({
      androidUserFacingChanges: [],
      crossPlatformUserFacingChanges: [],
      devChanges: [],
      iOSUserFacingChanges: [],
    })
  })
})

const prs = [
  {
    body: `
#run_new_changelog_check
### Changelog updates

#### iOS user-facing changes
- fixed button on iOS
`,
  },
  {
    body: `
#run_new_changelog_check
### Changelog updates

#### Cross-platform user-facing changes
- Added a new button
`,
  },
  {
    body: `
#run_new_changelog_check
### Changelog updates

#### Cross-platform user-facing changes
- Added an other button
- Fixed modal close button
`,
  },
  {
    body: `
#run_new_changelog_check
### Changelog updates
#### Dev changes
- Improved changelog tooling
- Upgraded lodash
`,
  },
  {
    body: `
#run_new_changelog_check
### Changelog updates
#### Dev changes
-
`,
  },
  {
    body: `
invalid
`,
  },
]
