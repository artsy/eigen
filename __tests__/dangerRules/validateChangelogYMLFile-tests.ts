import * as danger from "danger"
import { validatePRChangelog } from "../../dangerfile"
const dm = danger as any

jest.spyOn(console, "log").mockImplementation()
console.log = jest.fn()

describe("validatePRChangelog", () => {
  it("bails when the PR is not open", () => {
    dm.danger.github = { pr: { base: { repo: { name: "eigen" } }, state: "closed" } }
    validatePRChangelog()
    expect(console.log).toHaveBeenCalledWith("Skipping this check because the PR is not open")

    dm.danger.github = { pr: { base: { repo: { name: "eigen" } }, state: "locked" } }
    validatePRChangelog()
    expect(console.log).toHaveBeenCalledWith("Skipping this check because the PR is not open")

    dm.danger.github = { pr: { base: { repo: { name: "eigen" } }, state: "merged" } }
    validatePRChangelog()
    expect(console.log).toHaveBeenCalledWith("Skipping this check because the PR is not open")
  })

  it("warns the author when the PR body is invalid", () => {
    dm.danger.github = {
      pr: { body: "#run_new_changelog_check invalid body", base: { repo: { name: "eigen" } }, state: "open" },
    }
    validatePRChangelog()
    expect(dm.warn).toHaveBeenCalledWith(
      "❌ **An error occurred while validating your changelog, please make sure you provided a valid changelog.**"
    )
  })

  it("warns the author when no changelog changes were detected", () => {
    dm.danger.github = {
      pr: { body: "#run_new_changelog_check #nochangelog", base: { repo: { name: "eigen" } }, state: "open" },
    }
    validatePRChangelog()
    expect(dm.warn).toHaveBeenCalledWith("✅ **No changelog changes**")
  })

  it("returns the list of changes detected", () => {
    dm.danger.github = {
      pr: {
        body: `# Description

This pull request adds some stuff to the thing so that it can blah.
#run_new_changelog_check
### Changelog updates

#### Cross-platform user-facing changes
- Added a new button
  for the checkout flow
- Fixed modal close button
#### iOS user-facing changes
- Fixed input focus styles
#### Android user-facing changes
Updated splash screen color
#### Dev changes
- Improved changelog tooling
- Upgraded lodash

### Other stuff

blah`,
        base: { repo: { name: "eigen" } },
        state: "open",
      },
    }
    const res = validatePRChangelog()
    expect(res).toEqual(
      `### This PR contains the following changes:

- Android user-facing changes (Updated splash screen color)
- Cross-platform user-facing changes (Added a new button
for the checkout flow,Fixed modal close button)
- Dev changes (Improved changelog tooling,Upgraded lodash)
- iOS user-facing changes (Fixed input focus styles)`
    )
  })
})
