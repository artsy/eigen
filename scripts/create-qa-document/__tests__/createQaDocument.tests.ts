import { DateTime } from "luxon"

jest.mock("dotenv", () => ({ config: jest.fn() }))

jest.mock("../duplicateNotionTemplate", () => ({
  duplicateTemplate: jest.fn(),
  findExistingCopy: jest.fn(),
}))

import { extractChangelogFromPrBody } from "../changelog"
import { QA_DESTINATION_URL, QA_TEMPLATE_URL } from "../constants"
import { createQaDocument } from "../createQaDocument"
import { duplicateTemplate, findExistingCopy } from "../duplicateNotionTemplate"
import { getVersionFromBranch } from "../version"

const RC_BRANCH = "rc-v9.12.0"
// 2026-08-13 so the title stamps a known date.
const NOW = DateTime.fromISO("2026-08-13T10:00:00")
const mockFetch = jest.fn().mockResolvedValue({ ok: true })

describe("getVersionFromBranch", () => {
  it("parses the version out of an rc-v branch", () => {
    expect(getVersionFromBranch("rc-v9.12.0")).toEqual("9.12.0")
    expect(getVersionFromBranch("rc-v10.0.1")).toEqual("10.0.1")
  })

  it("throws for a non-rc branch", () => {
    expect(() => getVersionFromBranch("main")).toThrow(/rc-v<version>/)
    expect(() => getVersionFromBranch("feature/rc-v1.2.3")).toThrow()
  })
})

describe("extractChangelogFromPrBody", () => {
  it("pulls the section between '## Changelog' and '#nochangelog'", () => {
    const body = [
      "## Release Candidate 9.13.0",
      "",
      "Some preamble.",
      "",
      "## Changelog",
      "",
      "### Cross-platform user-facing changes",
      "- did a thing — someone (#1)",
      "",
      "#nochangelog",
    ].join("\n")

    expect(extractChangelogFromPrBody(body)).toEqual(
      "### Cross-platform user-facing changes\n- did a thing — someone (#1)"
    )
  })

  it("returns null when there is no changelog section", () => {
    expect(extractChangelogFromPrBody("just a normal PR body")).toBeNull()
    expect(extractChangelogFromPrBody("")).toBeNull()
  })
})

describe("createQaDocument", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, "log").mockImplementation(() => {})
    jest.spyOn(console, "warn").mockImplementation(() => {})
    jest.spyOn(console, "error").mockImplementation(() => {})
    process.env.SLACK_URL = "https://hooks.slack.com/services/TEST"
    delete process.env.IOS_BUILD
    delete process.env.ANDROID_BUILD
    delete process.env.PR_BODY
    ;(global as any).fetch = mockFetch
    ;(findExistingCopy as jest.Mock).mockResolvedValue(null)
    ;(duplicateTemplate as jest.Mock).mockResolvedValue("https://notion.so/new-qa-page")
  })

  afterEach(() => {
    jest.restoreAllMocks()
    delete process.env.SLACK_URL
    delete process.env.IOS_BUILD
    delete process.env.ANDROID_BUILD
    delete process.env.PR_BODY
  })

  it("duplicates the template with today's date + version and posts to Slack", async () => {
    await createQaDocument(RC_BRANCH, NOW)

    expect(duplicateTemplate).toHaveBeenCalledWith(QA_TEMPLATE_URL, QA_DESTINATION_URL, {
      version: "9.12.0",
      today: "2026-08-13",
      iosBuild: undefined,
      androidBuild: undefined,
      changelog: undefined,
    })
    expect(mockFetch).toHaveBeenCalledWith(
      "https://hooks.slack.com/services/TEST",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          text: ":notion: The mobile QA document for v9.12.0 is available here: https://notion.so/new-qa-page",
        }),
      })
    )
  })

  it("skips creation and re-posts the link when a doc already exists", async () => {
    ;(findExistingCopy as jest.Mock).mockResolvedValue("https://notion.so/existing-qa-page")

    await createQaDocument(RC_BRANCH, NOW)

    expect(duplicateTemplate).not.toHaveBeenCalled()
    expect(mockFetch).toHaveBeenCalledWith(
      "https://hooks.slack.com/services/TEST",
      expect.objectContaining({
        body: JSON.stringify({
          text: ":notion: The mobile QA document for v9.12.0 is available here: https://notion.so/existing-qa-page",
        }),
      })
    )
  })

  it("checks idempotency by version", async () => {
    await createQaDocument(RC_BRANCH, NOW)

    expect(findExistingCopy).toHaveBeenCalledWith(QA_DESTINATION_URL, ["9.12.0"])
  })

  it("passes the beta build numbers from env through to the duplicator", async () => {
    process.env.IOS_BUILD = "2026.08.13.18"
    process.env.ANDROID_BUILD = "2026081318"

    await createQaDocument(RC_BRANCH, NOW)

    expect(duplicateTemplate).toHaveBeenCalledWith(
      QA_TEMPLATE_URL,
      QA_DESTINATION_URL,
      expect.objectContaining({ iosBuild: "2026.08.13.18", androidBuild: "2026081318" })
    )
  })

  it("extracts the changelog from PR_BODY and passes it to the duplicator", async () => {
    process.env.PR_BODY =
      "## Release Candidate\n\n## Changelog\n\n### Dev changes\n- did a thing (#1)\n\n#nochangelog"

    await createQaDocument(RC_BRANCH, NOW)

    expect(duplicateTemplate).toHaveBeenCalledWith(
      QA_TEMPLATE_URL,
      QA_DESTINATION_URL,
      expect.objectContaining({ changelog: "### Dev changes\n- did a thing (#1)" })
    )
  })

  it("includes the changelog in the Slack message when present", async () => {
    process.env.PR_BODY =
      "## Release Candidate\n\n## Changelog\n\n### Dev changes\n- did a thing (#1)\n\n#nochangelog"

    await createQaDocument(RC_BRANCH, NOW)

    expect(mockFetch).toHaveBeenCalledWith(
      "https://hooks.slack.com/services/TEST",
      expect.objectContaining({
        body: JSON.stringify({
          text: ":notion: The mobile QA document for v9.12.0 is available here: https://notion.so/new-qa-page\n\n*Changelog*\n### Dev changes\n- did a thing (#1)",
        }),
      })
    )
  })

  it("skips the Slack post (without throwing) when SLACK_URL is not set", async () => {
    delete process.env.SLACK_URL

    await createQaDocument(RC_BRANCH, NOW)

    expect(duplicateTemplate).toHaveBeenCalled()
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it("does not fail the run when the Slack post errors (doc is the deliverable)", async () => {
    // The document was already created; a Slack outage must not turn the run red.
    ;(global as any).fetch = jest
      .fn()
      .mockResolvedValue({ ok: false, status: 500, statusText: "Server Error" })
    await expect(createQaDocument(RC_BRANCH, NOW)).resolves.toBeUndefined()
    expect(duplicateTemplate).toHaveBeenCalled()

    // Also survives a thrown/network error from fetch.
    ;(global as any).fetch = jest.fn().mockRejectedValue(new Error("network down"))
    await expect(createQaDocument(RC_BRANCH, NOW)).resolves.toBeUndefined()
  })

  it("throws for a branch that is not an rc-v branch", async () => {
    await expect(createQaDocument("main", NOW)).rejects.toThrow(/rc-v<version>/)
    expect(duplicateTemplate).not.toHaveBeenCalled()
  })
})
