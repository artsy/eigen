import {
  BLOCK_END,
  BLOCK_START,
  buildPreviewReport,
  isNativeStatus,
  isPublishResult,
  parsePullRequestBody,
  upsertPreviewBlock,
} from "../prDescription"

const input = {
  status: "level",
  publishResult: "success",
  channel: "preview-pr-13422",
  sha: "<sha>",
  fpBase: "a".repeat(40),
  fpPr: "b".repeat(40),
  fpMain: "c".repeat(40),
  runUrl: "https://github.com/artsy/eigen/actions/runs/1",
  prNumber: "13422",
  runtimePr: "9.19.0",
  runtimeMain: "9.19.0",
} as any

describe("buildPreviewReport", () => {
  it("says what was published when level", () => {
    const report = buildPreviewReport(input)

    expect(report).toContain(
      "Published `<sha>` to the `preview-pr-13422` channel for runtime `9.19.0`."
    )
    expect(report).not.toContain("[!")
  })

  it("shows the PR number and where to enter it when published", () => {
    for (const status of ["level", "behind"]) {
      const report = buildPreviewReport({ ...input, status })

      expect(report).toContain("**PR number: 13422**")
      expect(report).toContain("dev menu under Preview PRs, in the PR number field")
    }
  })

  it("warns with both fingerprints when behind", () => {
    const report = buildPreviewReport({ ...input, status: "behind" })

    expect(report).toContain("[!WARNING]")
    expect(report).toContain("\nPublished `<sha>`")
    expect(report).not.toContain("> Published")
    expect(report).toContain(input.fpPr)
    expect(report).toContain(input.fpMain)
  })

  it("blocks and asks for betas when ahead", () => {
    const report = buildPreviewReport({ ...input, status: "ahead", publishResult: "skipped" })

    expect(report).toContain("[!CAUTION]")
    expect(report).toContain("This PR changes native code")
    expect(report).toContain("deploy new betas")
    expect(report).not.toContain("Published `")
    expect(report).not.toContain("PR number")
  })

  it("reports a failed publish instead of claiming success", () => {
    const report = buildPreviewReport({ ...input, status: "behind", publishResult: "failure" })

    expect(report).toContain("Publishing to `preview-pr-13422` failed")
    expect(report).toContain(input.runUrl)
    expect(report).not.toContain("Published `")
    expect(report).not.toContain("PR number")
  })

  it("reports ahead even when the publish result is not success", () => {
    const report = buildPreviewReport({ ...input, status: "ahead", publishResult: "failure" })

    expect(report).toContain("This PR changes native code")
  })
})

describe("runtime version warning", () => {
  const stale = { ...input, runtimePr: "9.19.0", runtimeMain: "9.20.0" }

  it("warns when the PR runtime differs from main's", () => {
    const report = buildPreviewReport(stale)

    expect(report).toContain("[!WARNING]")
    expect(report).toContain("targets runtime `9.19.0`, but `main` is on `9.20.0`")
    expect(report).toContain("Rebase onto `main` to pick up the new version.")
  })

  it("stacks with the behind warning", () => {
    const report = buildPreviewReport({ ...stale, status: "behind" })

    expect(report.match(/\[!WARNING\]/g)).toHaveLength(2)
  })

  it("stays quiet when the runtimes match", () => {
    expect(buildPreviewReport(input)).not.toContain("targets runtime")
  })

  it("is not shown when nothing is published", () => {
    expect(buildPreviewReport({ ...stale, status: "ahead" })).not.toContain("targets runtime")
    expect(buildPreviewReport({ ...stale, publishResult: "failure" })).not.toContain(
      "targets runtime"
    )
  })
})

describe("upsertPreviewBlock", () => {
  it("returns only the block for an empty description", () => {
    expect(upsertPreviewBlock({ body: "", report: "new" })).toEqual(
      `${BLOCK_START}\nnew\n${BLOCK_END}`
    )
  })

  it("appends the block after the author's text", () => {
    expect(upsertPreviewBlock({ body: "Fixes the thing.\n", report: "new" })).toEqual(
      `Fixes the thing.\n\n${BLOCK_START}\nnew\n${BLOCK_END}`
    )
  })

  it("replaces an existing block and keeps the text around it", () => {
    const body = `Intro\n\n${BLOCK_START}\nold\n${BLOCK_END}\n\nOutro`

    expect(upsertPreviewBlock({ body, report: "new" })).toEqual(
      `Intro\n\n${BLOCK_START}\nnew\n${BLOCK_END}\n\nOutro`
    )
  })

  it("is stable when run twice", () => {
    const once = upsertPreviewBlock({ body: "Intro", report: "new" })

    expect(upsertPreviewBlock({ body: once, report: "new" })).toEqual(once)
  })

  it("appends a fresh block when the end marker is missing", () => {
    const body = `Intro\n${BLOCK_START}\nbroken`

    expect(upsertPreviewBlock({ body, report: "new" })).toEqual(
      `${body}\n\n${BLOCK_START}\nnew\n${BLOCK_END}`
    )
  })
})

describe("parsePullRequestBody", () => {
  it("returns the body", () => {
    expect(parsePullRequestBody(JSON.stringify({ body: "hello", number: 1 }))).toEqual("hello")
  })

  it("treats a null body as empty", () => {
    expect(parsePullRequestBody(JSON.stringify({ body: null }))).toEqual("")
  })

  it.each([["{}"], ['{"body": 5}'], ['"text"'], ["null"]])("rejects %s", (json) => {
    expect(() => parsePullRequestBody(json)).toThrow("no body field")
  })
})

describe("guards", () => {
  it("accepts known values only", () => {
    expect(isNativeStatus("ahead")).toBe(true)
    expect(isNativeStatus("sideways")).toBe(false)
    expect(isPublishResult("skipped")).toBe(true)
    expect(isPublishResult("")).toBe(false)
  })
})
