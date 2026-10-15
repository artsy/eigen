import { checkProductionGate, GateContext, nextHotfixNumber } from "../productionGate"

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

describe("nextHotfixNumber", () => {
  it("counts from what has already shipped", () => {
    expect(nextHotfixNumber(0)).toBe(1)
    expect(nextHotfixNumber(2)).toBe(3)
  })
})
