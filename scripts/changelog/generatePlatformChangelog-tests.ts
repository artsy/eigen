import { getCombinedChangeLog, getPlaformSpecificChangeLog, isMergedAfter } from "./generatePlatformChangelog"

jest.mock("../../app.json", () => ({
  version: "6.9.4",
}))

jest.mock("argparse", () => ({
  ArgumentParser: () => ({
    add_argument: jest.fn(),
    parse_args: () => ({ platform: "ios" }),
  }),
}))

beforeEach(() => {
  jest
    .spyOn(Date.prototype, "toString")
    .mockReturnValue("Fri Jun 04 2021 15:48:24 GMT+0200 (Central European Summer Time)")
})

afterEach(() => {
  jest.clearAllMocks()
})

describe("isMergedAfter", () => {
  it("returns false when the PR has not been merged (merged_at is null)", () => {
    expect(isMergedAfter(null, new Date("01 June 2021"))).toEqual(false)
  })

  it("returns false when the PR has not been merged before the release commit date", () => {
    expect(isMergedAfter("01 June 2021 ", new Date("02 June 2021"))).toEqual(false)
  })

  it("returns true when the PR has been merged after the release commit date ", () => {
    expect(isMergedAfter("02 June 2021 ", new Date("01 June 2021"))).toEqual(true)
  })
})

describe("getCombinedChangeLog", () => {
  it("gets the combined changelog from all prs", () => {
    expect(getCombinedChangeLog(prs as any)).toEqual({
      androidUserFacingChanges: [],
      crossPlatformUserFacingChanges: ["Added a new button", "Added an other button", "Fixed modal close button"],
      devChanges: ["Improved changelog tooling", "Upgraded lodash"],
      iOSUserFacingChanges: ["fixed button on iOS"],
    })
  })
  it("returns nothing when nothing changed", () => {
    expect(getCombinedChangeLog([] as any)).toEqual({
      androidUserFacingChanges: [],
      crossPlatformUserFacingChanges: [],
      devChanges: [],
      iOSUserFacingChanges: [],
    })
  })
})

describe("getPlaformSpecificChangeLog", () => {
  it("gets the combined changelog from all prs", () => {
    const changelog = {
      androidUserFacingChanges: [],
      crossPlatformUserFacingChanges: ["Added a new button", "Added an other button", "Fixed modal close button"],
      devChanges: ["Improved changelog tooling", "Upgraded lodash"],
      iOSUserFacingChanges: ["fixed button on iOS"],
    }
    expect(getPlaformSpecificChangeLog("ios", changelog)).toEqual(
      `
## Released Changes

### v6.9.4

- Status: **Released**
- App store submission date: **Fri Jun 04 2021 15:48:24 GMT+0200 (Central European Summer Time)**
- Changelog:

  - User facing changes:
    - Added a new button
    - Added an other button
    - Fixed modal close button
    - fixed button on iOS

  - Dev changes:
    - Improved changelog tooling
    - Upgraded lodash
`
    )
  })
  it("returns nothing when nothing changed", () => {
    const emptyChangeLog = {
      androidUserFacingChanges: [],
      crossPlatformUserFacingChanges: [],
      devChanges: [],
      iOSUserFacingChanges: [],
    }
    expect(getPlaformSpecificChangeLog("ios", emptyChangeLog)).toEqual(
      `
## Released Changes

### v6.9.4

- Status: **Released**
- App store submission date: **Fri Jun 04 2021 15:48:24 GMT+0200 (Central European Summer Time)**
- Changelog:
`
    )
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
