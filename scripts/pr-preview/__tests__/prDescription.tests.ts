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
  channel: "preview-pr-42",
  sha: "<sha>",
  fpBase: "a".repeat(40),
  fpPr: "b".repeat(40),
  fpMain: "c".repeat(40),
  runUrl: "https://github.com/artsy/eigen/actions/runs/1",
} as any

describe("buildPreviewReport", () => {
  it("says what was published when level", () => {
    const report = buildPreviewReport(input)

    expect(report).toContain("Published `<sha>` to the `preview-pr-42` channel.")
    expect(report).not.toContain("[!")
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
  })

  it("reports a failed publish instead of claiming success", () => {
    const report = buildPreviewReport({ ...input, status: "behind", publishResult: "failure" })

    expect(report).toContain("Publishing to `preview-pr-42` failed")
    expect(report).toContain(input.runUrl)
    expect(report).not.toContain("Published `")
  })

  it("reports ahead even when the publish result is not success", () => {
    const report = buildPreviewReport({ ...input, status: "ahead", publishResult: "failure" })

    expect(report).toContain("This PR changes native code")
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
