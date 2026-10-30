import { DateTime } from "luxon"

jest.mock("dotenv", () => ({ config: jest.fn() }))

jest.mock("../duplicateNotionTemplate", () => ({
  duplicateTemplate: jest.fn(),
  findExistingCopy: jest.fn(),
}))

import { extractChangelogFromPrBody, extractContributorsFromChangelog } from "../changelog"
import { QA_DESTINATION_URL, QA_TEMPLATE_URL } from "../constants"
import { createQaDocument, qaDocumentMatchKeys } from "../createQaDocument"
import { duplicateTemplate, findExistingCopy } from "../duplicateNotionTemplate"
import { getVersionFromBranch, isHotfixBranch } from "../version"

const RC_BRANCH = "rc-v9.12.0"
// 2026-08-13 so the title stamps a known date.
const NOW = DateTime.fromISO("2026-08-13T10:00:00")
const mockFetch = jest
  .fn()
  .mockResolvedValue({ ok: true, json: async () => ({ ok: true, ts: "1000.1" }) })

describe("getVersionFromBranch", () => {
  it("parses the version out of an rc-v branch", () => {
    expect(getVersionFromBranch("rc-v9.12.0")).toEqual("9.12.0")
    expect(getVersionFromBranch("rc-v10.0.1")).toEqual("10.0.1")
  })

  it("strips the -hotfix suffix", () => {
    expect(getVersionFromBranch("rc-v7.2.1-hotfix")).toEqual("7.2.1")
  })

  it("detects hotfix branches", () => {
    expect(isHotfixBranch("rc-v7.2.1-hotfix")).toBe(true)
    expect(isHotfixBranch("rc-v7.2.1")).toBe(false)
  })

  it("throws for a non-rc branch", () => {
    expect(() => getVersionFromBranch("main")).toThrow(/rc-v<version>/)
    expect(() => getVersionFromBranch("feature/rc-v1.2.3")).toThrow()
    expect(() => getVersionFromBranch("rc-v1.2.3-test")).toThrow()
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

describe("extractContributorsFromChangelog", () => {
  it("collects the handles, de-duplicated, in first-appearance order", () => {
    const changelog = [
      "### Cross-platform user-facing changes",
      "- fix milliseconds showing in timers — MrSltun (#13830)",
      "- copy update on edit profile — gkartalis (#13832)",
      "",
      "### Dev changes",
      "- fixes form data vulnerability — gkartalis (#13828)",
      "- copy updates — JanaeHijaz (#13843)",
    ].join("\n")

    expect(extractContributorsFromChangelog(changelog)).toEqual([
      "MrSltun",
      "gkartalis",
      "JanaeHijaz",
    ])
  })

  it("takes the separator dash, not a dash inside the description", () => {
    const changelog =
      "- add missing alias routes, route matching minor speedup - brian — brainbicycle (#13868)"

    expect(extractContributorsFromChangelog(changelog)).toEqual(["brainbicycle"])
  })

  it("skips lines that aren't changelog entries", () => {
    const changelog = ["### Dev changes", "", "some hand-written note", "- no handle here"].join(
      "\n"
    )

    expect(extractContributorsFromChangelog(changelog)).toEqual([])
    expect(extractContributorsFromChangelog("")).toEqual([])
  })
})

describe("createQaDocument", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, "log").mockImplementation(() => {})
    jest.spyOn(console, "warn").mockImplementation(() => {})
    jest.spyOn(console, "error").mockImplementation(() => {})
    process.env.SLACK_TOKEN = "xoxb-test-token"
    process.env.SLACK_CHANNEL = "C12345"
    delete process.env.IOS_BUILD
    delete process.env.ANDROID_BUILD
    delete process.env.PR_BODY
    ;(global as any).fetch = mockFetch
    ;(findExistingCopy as jest.Mock).mockResolvedValue(null)
    ;(duplicateTemplate as jest.Mock).mockResolvedValue("https://notion.so/new-qa-page")
  })

  afterEach(() => {
    jest.restoreAllMocks()
    delete process.env.SLACK_TOKEN
    delete process.env.SLACK_CHANNEL
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
      "https://slack.com/api/chat.postMessage",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ Authorization: "Bearer xoxb-test-token" }),
        body: JSON.stringify({
          channel: "C12345",
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
      "https://slack.com/api/chat.postMessage",
      expect.objectContaining({
        body: JSON.stringify({
          channel: "C12345",
          text: ":notion: The mobile QA document for v9.12.0 is available here: https://notion.so/existing-qa-page",
        }),
      })
    )
  })

  it("checks idempotency by version + build numbers", async () => {
    process.env.IOS_BUILD = "2026.08.13.18"
    process.env.ANDROID_BUILD = "2026081318"

    await createQaDocument(RC_BRANCH, NOW)

    expect(findExistingCopy).toHaveBeenCalledWith(QA_DESTINATION_URL, [
      "version 9.12.0,",
      "iOS build 2026.08.13.18 ",
      "Android build 2026081318)",
    ])
  })

  it("falls back to version + date when there are no build numbers", async () => {
    await createQaDocument(RC_BRANCH, NOW)

    expect(findExistingCopy).toHaveBeenCalledWith(QA_DESTINATION_URL, [
      "version 9.12.0,",
      "2026-08-13",
    ])
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

  it("appends the contributor handles to the threaded changelog reply", async () => {
    process.env.PR_BODY =
      "## Release Candidate\n\n## Changelog\n\n### Dev changes\n- did a thing — gkartalis (#1)\n- did another — iskounen (#2)\n\n#nochangelog"

    await createQaDocument(RC_BRANCH, NOW)

    expect(mockFetch).toHaveBeenNthCalledWith(
      2,
      "https://slack.com/api/chat.postMessage",
      expect.objectContaining({
        body: JSON.stringify({
          channel: "C12345",
          text: "*Changelog*\n### Dev changes\n- did a thing — gkartalis (#1)\n- did another — iskounen (#2)\n\n*Contributors:* gkartalis, iskounen",
          thread_ts: "1000.1",
        }),
      })
    )
  })

  it("posts the changelog as a threaded reply under the main message", async () => {
    process.env.PR_BODY =
      "## Release Candidate\n\n## Changelog\n\n### Dev changes\n- did a thing (#1)\n\n#nochangelog"

    await createQaDocument(RC_BRANCH, NOW)

    expect(mockFetch).toHaveBeenNthCalledWith(
      1,
      "https://slack.com/api/chat.postMessage",
      expect.objectContaining({
        body: JSON.stringify({
          channel: "C12345",
          text: ":notion: The mobile QA document for v9.12.0 is available here: https://notion.so/new-qa-page",
        }),
      })
    )
    expect(mockFetch).toHaveBeenNthCalledWith(
      2,
      "https://slack.com/api/chat.postMessage",
      expect.objectContaining({
        body: JSON.stringify({
          channel: "C12345",
          text: "*Changelog*\n### Dev changes\n- did a thing (#1)",
          thread_ts: "1000.1",
        }),
      })
    )
  })

  it("does not post a second Slack message when there is no changelog", async () => {
    await createQaDocument(RC_BRANCH, NOW)

    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it("skips the Slack post (without throwing) when SLACK_TOKEN is not set", async () => {
    delete process.env.SLACK_TOKEN

    await createQaDocument(RC_BRANCH, NOW)

    expect(duplicateTemplate).toHaveBeenCalled()
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it("does not fail the run when the Slack post errors (doc is the deliverable)", async () => {
    // The document was already created; a Slack outage must not turn the run red.
    ;(global as any).fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Server Error",
      json: async () => ({}),
    })
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

describe("qaDocumentMatchKeys", () => {
  // Real titles from the Mobile App QA page.
  const yesterday =
    "2026-10-29 Mobile App QA (version 9.22.0, iOS build 2026.10.29.11 Android build 2026102911)"
  const today =
    "2026-10-30 Mobile App QA (version 9.22.0, iOS build 2026.10.30.10 Android build 2026103010)"
  const matches = (title: string, keys: string[]) => keys.every((k) => title.includes(k))

  it("matches a doc for the same builds (re-run)", () => {
    const keys = qaDocumentMatchKeys({
      version: "9.22.0",
      today: "2026-10-30",
      iosBuild: "2026.10.30.10",
      androidBuild: "2026103010",
    })
    expect(matches(today, keys)).toBe(true)
    expect(matches(yesterday, keys)).toBe(false)
  })

  it("does not match a prefix version or the hotfix doc", () => {
    const title = "2026-10-30 Mobile App QA (version 9.22.10, iOS build 1 Android build 2)"
    const hotfix = "2026-10-30 Mobile App QA (version 9.22.1-hotfix, iOS build 1 Android build 2)"
    const keys = qaDocumentMatchKeys({ version: "9.22.1", today: "2026-10-30" })
    expect(matches(title, keys)).toBe(false)
    expect(matches(hotfix, keys)).toBe(false)
  })

  it("matches the hotfix doc by its own version", () => {
    const hotfix = "2026-10-30 Mobile App QA (version 9.22.1-hotfix, iOS build 1 Android build 2)"
    const keys = qaDocumentMatchKeys({
      version: "9.22.1-hotfix",
      today: "2026-10-30",
      iosBuild: "1",
      androidBuild: "2",
    })
    expect(matches(hotfix, keys)).toBe(true)
  })
})
