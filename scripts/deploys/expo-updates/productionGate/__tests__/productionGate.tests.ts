import {
  checkProductionGate,
  GateContext,
  nextHotfixNumber,
  pickHotfixPullRequest,
  unpublishedHotfixSections,
} from "../productionGate"

const VERSION = "9.21.0"
const SHA = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
const IOS_SUBMISSION = `ios-${VERSION}-2026.03.11.18-submission`
const ANDROID_SUBMISSION = `android-${VERSION}-2026031118-submission`

const validContext = (overrides: Partial<GateContext> = {}): GateContext => ({
  version: VERSION,
  branch: `hotfix-v${VERSION}`,
  sha: SHA,
  platform: "all",
  branchHeadSha: SHA,
  hotfixPullRequest: { number: 1234, baseRef: `rc-v${VERSION}`, merged: false },
  submissionTags: { ios: IOS_SUBMISSION, android: ANDROID_SUBMISSION },
  previousProductionTags: { ios: null, android: null },
  descendsFrom: { [IOS_SUBMISSION]: true, [ANDROID_SUBMISSION]: true },
  canaryTags: { ios: true, android: true },
  currentHour: "2026102213",
  ...overrides,
})

describe("checkProductionGate", () => {
  it("passes for a well-formed first hotfix", () => {
    expect(checkProductionGate(validContext())).toEqual({ ok: true, failures: [] })
  })

  it("passes for a hotfix on top of an earlier hotfix", () => {
    const previousIos = `ios-expo-production-${VERSION}-2026.10.01.09`
    const previousAndroid = `android-expo-production-${VERSION}-2026100109`

    const result = checkProductionGate(
      validContext({
        previousProductionTags: { ios: previousIos, android: previousAndroid },
        descendsFrom: {
          [IOS_SUBMISSION]: true,
          [ANDROID_SUBMISSION]: true,
          [previousIos]: true,
          [previousAndroid]: true,
        },
      })
    )

    expect(result.ok).toBe(true)
  })

  describe("rejects the publishes that motivated the gate", () => {
    // 2026-10-13: production published from the branch of PR #14307, which was open and
    // targeted 9.20.1-hotfix rather than the release branch.
    it("a publish from a feature branch with a PR into the wrong base", () => {
      const result = checkProductionGate(
        validContext({
          branch: "araujobarret/city-guide-release-adjusts",
          hotfixPullRequest: { number: 14307, baseRef: "9.20.1-hotfix", merged: false },
          canaryTags: { ios: false, android: false },
        })
      )

      expect(result.ok).toBe(false)
      expect(result.failures).toEqual(
        expect.arrayContaining([
          expect.stringContaining(`can only be published from "hotfix-v${VERSION}"`),
          expect.stringContaining(`targets "9.20.1-hotfix"`),
          expect.stringContaining("No successful ios or android canary publish"),
        ])
      )
    })

    // 2026-10-08: published from a laptop, from a commit that is on no branch at all.
    it("a publish of a commit that isn't on the hotfix branch", () => {
      const result = checkProductionGate(
        validContext({
          branch: "main",
          sha: "19324e352a19324e352a19324e352a19324e352a",
          branchHeadSha: SHA,
          hotfixPullRequest: null,
          descendsFrom: { [IOS_SUBMISSION]: false, [ANDROID_SUBMISSION]: false },
          canaryTags: { ios: false, android: false },
        })
      )

      expect(result.ok).toBe(false)
      expect(result.failures).toEqual(
        expect.arrayContaining([
          expect.stringContaining("No pull request"),
          expect.stringContaining("doesn't descend from the ios store submission"),
        ])
      )
    })
  })

  it("rejects a single-platform production publish", () => {
    const result = checkProductionGate(validContext({ platform: "ios" }))

    expect(result.ok).toBe(false)
    expect(result.failures).toEqual([expect.stringContaining("must cover both platforms")])
  })

  it("rejects publishing a commit behind the branch tip", () => {
    const result = checkProductionGate({
      ...validContext(),
      branchHeadSha: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    })

    expect(result.ok).toBe(false)
    expect(result.failures).toEqual([expect.stringContaining("isn't the tip of")])
  })

  it("rejects a commit that drops an earlier hotfix", () => {
    const previousIos = `ios-expo-production-${VERSION}-2026.10.01.09`

    const result = checkProductionGate(
      validContext({
        previousProductionTags: { ios: previousIos, android: null },
        descendsFrom: {
          [IOS_SUBMISSION]: true,
          [ANDROID_SUBMISSION]: true,
          [previousIos]: false,
        },
      })
    )

    expect(result.ok).toBe(false)
    expect(result.failures).toEqual([
      expect.stringContaining("doesn't descend from the previous ios production update"),
    ])
  })

  it("rejects a merged hotfix PR", () => {
    const result = checkProductionGate(
      validContext({
        hotfixPullRequest: { number: 1234, baseRef: `rc-v${VERSION}`, merged: true },
      })
    )

    expect(result.ok).toBe(false)
    expect(result.failures).toEqual([expect.stringContaining("was merged")])
  })

  it("rejects a canary that didn't cover both platforms", () => {
    // A canary tag only exists once `eas update` succeeded for that platform, so a missing tag
    // covers both "never published" and "published but failed".
    expect(
      checkProductionGate(validContext({ canaryTags: { ios: true, android: false } })).failures
    ).toEqual([expect.stringContaining("No successful android canary publish")])
  })

  it("rejects a production publish with no canary at all", () => {
    expect(
      checkProductionGate(validContext({ canaryTags: { ios: false, android: false } })).failures
    ).toEqual([expect.stringContaining("No successful ios or android canary publish")])
  })

  describe("two production publishes in the same hour", () => {
    // The tag name stops at the hour and fastlane force-moves an existing tag.
    const sameHourIos = `ios-expo-production-${VERSION}-2026.10.22.13`
    const sameHourAndroid = `android-expo-production-${VERSION}-2026102213`

    const withPrevious = (ios: string | null, android: string | null) =>
      validContext({
        previousProductionTags: { ios, android },
        descendsFrom: {
          [IOS_SUBMISSION]: true,
          [ANDROID_SUBMISSION]: true,
          ...(ios ? { [ios]: true } : {}),
          ...(android ? { [android]: true } : {}),
        },
      })

    it("rejects a publish when the previous one has this hour's tag", () => {
      const result = checkProductionGate(withPrevious(sameHourIos, sameHourAndroid))

      expect(result.ok).toBe(false)
      expect(result.failures).toEqual([expect.stringContaining("already published")])
    })

    it("rejects it when only the android tag is from this hour", () => {
      const result = checkProductionGate(
        withPrevious(`ios-expo-production-${VERSION}-2026.10.22.12`, sameHourAndroid)
      )

      expect(result.failures).toEqual([expect.stringContaining(sameHourAndroid)])
    })

    it("allows a publish in a later hour, or on a later day at the same hour", () => {
      expect(
        checkProductionGate(
          withPrevious(
            `ios-expo-production-${VERSION}-2026.10.22.12`,
            `android-expo-production-${VERSION}-2026102212`
          )
        ).ok
      ).toBe(true)
      expect(
        checkProductionGate(
          withPrevious(
            `ios-expo-production-${VERSION}-2026.10.21.13`,
            `android-expo-production-${VERSION}-2026102113`
          )
        ).ok
      ).toBe(true)
    })
  })

  it("rejects a version with no store submission tag", () => {
    const result = checkProductionGate(
      validContext({ submissionTags: { ios: null, android: ANDROID_SUBMISSION } })
    )

    expect(result.ok).toBe(false)
    expect(result.failures).toEqual([
      expect.stringContaining(`No ios submission tag found for ${VERSION}`),
    ])
  })
})

describe("pickHotfixPullRequest", () => {
  const pr = (number: number, overrides = {}) => ({
    number,
    baseRefName: `rc-v${VERSION}`,
    state: "OPEN",
    isCrossRepository: false,
    ...overrides,
  })

  it("returns nothing when there are no PRs", () => {
    expect(pickHotfixPullRequest([])).toBeNull()
  })

  it("ignores a fork PR that reuses the hotfix branch name", () => {
    // Anyone can open one against a public repo, and it would otherwise win by being newest.
    expect(pickHotfixPullRequest([pr(1234), pr(9999, { isCrossRepository: true })])).toEqual({
      number: 1234,
      baseRef: `rc-v${VERSION}`,
      merged: false,
    })
  })

  it("returns nothing when the only PR is from a fork", () => {
    expect(pickHotfixPullRequest([pr(9999, { isCrossRepository: true })])).toBeNull()
  })

  it("prefers the newest PR, so a stale one from a reused branch name doesn't win", () => {
    expect(pickHotfixPullRequest([pr(1000, { state: "MERGED" }), pr(1234)])?.number).toBe(1234)
  })

  it("reports a merged PR and the branch it targets", () => {
    expect(
      pickHotfixPullRequest([pr(1234, { state: "MERGED", baseRefName: "9.20.1-hotfix" })])
    ).toEqual({ number: 1234, baseRef: "9.20.1-hotfix", merged: true })
  })
})

describe("nextHotfixNumber", () => {
  it("counts from what has already shipped", () => {
    expect(nextHotfixNumber(0)).toBe(1)
    expect(nextHotfixNumber(2)).toBe(3)
  })
})

describe("unpublishedHotfixSections", () => {
  // Full SHAs, so the tests can tell an abbreviation of one from an abbreviation of another.
  const A = "a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1"
  const B = "b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2"
  const C = "c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3"
  const D = "d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4"

  /** The shape start-hotfix writes: heading names the base, the list names the section's commits */
  const section = (base: string, tip: string, fix: string, verb = "Applied", abbrev = 7) =>
    [
      `## ${verb} on top of \`${base.slice(0, abbrev)}\` · 2026-10-22`,
      "",
      `- ${fix} (\`${tip.slice(0, abbrev)}\`)`,
      "",
      "### Changelog",
      "",
      "```",
      `- ${fix}`,
      "```",
    ].join("\n")

  const prBody = (...sections: string[]) =>
    ["> **Do not merge.**", "", "#nochangelog", "", ...sections.map((it) => `\n${it}`)].join("\n")

  const headings = (notes: string) => notes.match(/^## .*$/gm)

  it("ships every section when nothing has been published yet", () => {
    const body = prBody(section(A, B, "fix one"), section(B, C, "fix two"))

    expect(headings(unpublishedHotfixSections(body, null))).toEqual([
      expect.stringContaining("`a1a1a1a`"),
      expect.stringContaining("`b2b2b2b`"),
    ])
  })

  // The regression: the published tip is B, which section one lists as its own commit and
  // section two names in its heading. Only section two is unpublished.
  it("starts at the section based on the published commit, not the one that lists it", () => {
    const body = prBody(section(A, B, "fix one"), section(B, C, "fix two"))
    const notes = unpublishedHotfixSections(body, B)

    expect(headings(notes)).toEqual([expect.stringContaining("`b2b2b2b`")])
    expect(notes).toContain("fix two")
    expect(notes).not.toContain("fix one")
  })

  it("ships every section applied since the last publish", () => {
    const body = prBody(
      section(A, B, "fix one"),
      section(B, C, "fix two"),
      section(C, D, "fix three")
    )

    expect(unpublishedHotfixSections(body, B)).toContain("fix two")
    expect(unpublishedHotfixSections(body, B)).toContain("fix three")
    expect(unpublishedHotfixSections(body, B)).not.toContain("fix one")
    expect(unpublishedHotfixSections(body, C)).toContain("fix three")
    expect(unpublishedHotfixSections(body, C)).not.toContain("fix two")
  })

  it("matches however long each clone abbreviated the SHA", () => {
    // Written on a laptop with a long abbreviation, read on a runner that would pick a short one.
    const body = prBody(
      section(A, B, "fix one", "Applied", 12),
      section(B, C, "fix two", "Applied", 9)
    )

    const notes = unpublishedHotfixSections(body, B)

    expect(notes).toContain("fix two")
    expect(notes).not.toContain("fix one")
  })

  it("treats a revert section like any other", () => {
    const body = prBody(section(A, B, "fix one"), section(B, C, "Revert fix one", "Reverted"))
    const notes = unpublishedHotfixSections(body, B)

    expect(notes).toContain("Revert fix one")
    expect(notes).not.toContain("- fix one")
  })

  it("reads a body that GitHub saved with CRLF line endings", () => {
    const body = prBody(section(A, B, "fix one"), section(B, C, "fix two")).replace(/\n/g, "\r\n")
    const notes = unpublishedHotfixSections(body, B)

    expect(notes).toContain("fix two")
    expect(notes).not.toContain("fix one")
  })

  it("ships everything when no heading names the published commit", () => {
    // A hand-edited PR: over-report rather than hide a fix that is going out.
    const body = prBody(section(A, B, "fix one"), section(B, C, "fix two"))
    const notes = unpublishedHotfixSections(body, D)

    expect(notes).toContain("fix one")
    expect(notes).toContain("fix two")
  })

  it("ignores text before the first section, and returns nothing when there are none", () => {
    expect(unpublishedHotfixSections(prBody(), B)).toBe("")
    expect(unpublishedHotfixSections(prBody(), null)).toBe("")
    expect(unpublishedHotfixSections(prBody(section(A, B, "fix one")), null)).not.toContain(
      "Do not merge"
    )
  })

  it("won't match a heading whose SHA is too short to be an abbreviation", () => {
    const body = prBody(section(A, B, "fix one", "Applied", 3), section(B, C, "fix two"))

    // Section one's three-character heading is skipped, so section two is the first that matches.
    expect(unpublishedHotfixSections(body, A)).toContain("fix one")
    expect(unpublishedHotfixSections(body, B)).not.toContain("fix one")
  })
})
