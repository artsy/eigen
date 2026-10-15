/**
 * The rules a production Expo Update has to satisfy before it can be published.
 *
 * Production OTA updates reach users without store review, so they get the same guarantees as a
 * store release: the code is on a hotfix branch, that branch has a "do not merge" hotfix PR, the
 * branch descends from what users are actually running, and a canary of the exact same commit
 * was published and tested first.
 *
 * This module is pure so the rules can be unit-tested; `checkProductionGate.ts` gathers the
 * context from git/gh and calls it.
 */

export type Platform = "ios" | "android"

export const PLATFORMS: Platform[] = ["ios", "android"]

export interface HotfixPullRequest {
  number: number
  /** Branch the PR targets, e.g. "rc-v9.21.0" */
  baseRef: string
  merged: boolean
}

export interface GateContext {
  /** `version` from app.json on the checked-out commit */
  version: string
  /** Branch the workflow was dispatched on */
  branch: string
  /** `sha` input — the commit being published */
  sha: string
  /** `platform` input */
  platform: string
  /** Current HEAD of `branch` on origin */
  branchHeadSha: string
  /** The hotfix PR opened from `branch`, if any */
  hotfixPullRequest: HotfixPullRequest | null
  /** Per platform, the store submission tag for `version` */
  submissionTags: Record<Platform, string | null>
  /**
   * Per platform, the most recent `<platform>-expo-production-<version>-*` tag, or null when this
   * is the first OTA hotfix for the version.
   */
  previousProductionTags: Record<Platform, string | null>
  /** Tag name -> whether `sha` descends from it (or is it). Populated for every tag above. */
  descendsFrom: Record<string, boolean>
  /**
   * Per platform, whether a canary Expo Update tag points at `sha`.
   *
   * Fastlane only tags after `eas update` has succeeded, so the tag existing on this exact commit
   * is proof that a canary of this code was published for that platform — stronger evidence than
   * a workflow run, and it can't drift if the run's name changes.
   */
  canaryTags: Record<Platform, boolean>
}

export interface GateResult {
  ok: boolean
  failures: string[]
}

export const hotfixBranchFor = (version: string) => `hotfix-v${version}`

export const releaseBranchFor = (version: string) => `rc-v${version}`

/**
 * Hotfix N, counted from what has actually shipped rather than from the PR, so a hotfix section
 * whose publish failed doesn't shift the numbering of everything after it.
 */
export const nextHotfixNumber = (previousProductionTagCount: number) =>
  previousProductionTagCount + 1

const checkAncestry = ({
  descendsFrom,
  tag,
  label,
  failures,
}: {
  descendsFrom: Record<string, boolean>
  tag: string | null
  label: string
  failures: string[]
}) => {
  if (!tag) return
  if (!descendsFrom[tag]) {
    failures.push(`The commit being published doesn't descend from ${label} (${tag}).`)
  }
}

export const checkProductionGate = (context: GateContext): GateResult => {
  const failures: string[] = []
  const expectedBranch = hotfixBranchFor(context.version)
  const expectedBase = releaseBranchFor(context.version)

  // 1. Production hotfixes always ship to both platforms, so the record (tags, Sentry releases,
  //    GitHub release) is the same shape every time.
  if (context.platform !== "all") {
    failures.push(
      `Production publishes must cover both platforms, but platform was "${context.platform}".`
    )
  }

  // 2. Published from the hotfix branch for this version, at its tip.
  if (context.branch !== expectedBranch) {
    failures.push(
      `Production updates can only be published from "${expectedBranch}" (app.json version ` +
        `${context.version}), but this ran on "${context.branch}".`
    )
  } else if (context.sha !== context.branchHeadSha) {
    failures.push(
      `The commit being published (${context.sha}) isn't the tip of "${expectedBranch}" ` +
        `(${context.branchHeadSha}). Publishing anything but the tip would silently drop the ` +
        `hotfixes between them.`
    )
  }

  // 3. A hotfix PR exists, targets the release branch, and was never merged.
  const pr = context.hotfixPullRequest
  if (!pr) {
    failures.push(
      `No pull request from "${context.branch}" into "${expectedBase}". Run start-hotfix to open ` +
        `the hotfix PR before publishing.`
    )
  } else {
    if (pr.baseRef !== expectedBase) {
      failures.push(
        `The hotfix PR (#${pr.number}) targets "${pr.baseRef}" instead of "${expectedBase}".`
      )
    }
    if (pr.merged) {
      failures.push(
        `The hotfix PR (#${pr.number}) was merged. Hotfix PRs are never merged — the branch tip ` +
          `is the record of what's live.`
      )
    }
  }

  // 4. The commit contains what users are already running: the store build, and every OTA hotfix
  //    already published for this version.
  for (const platform of PLATFORMS) {
    checkAncestry({
      descendsFrom: context.descendsFrom,
      tag: context.submissionTags[platform],
      label: `the ${platform} store submission for ${context.version}`,
      failures,
    })
    checkAncestry({
      descendsFrom: context.descendsFrom,
      tag: context.previousProductionTags[platform],
      label: `the previous ${platform} production update`,
      failures,
    })

    if (!context.submissionTags[platform]) {
      failures.push(
        `No ${platform} submission tag found for ${context.version}, so there's nothing to ` +
          `confirm this update is built on the shipped build.`
      )
    }
  }

  // 5. The exact same commit was published to canary first, and QA'd from there.
  const missingCanaries = PLATFORMS.filter((platform) => !context.canaryTags[platform])
  if (missingCanaries.length > 0) {
    failures.push(
      `No successful ${missingCanaries.join(" or ")} canary publish of ${context.sha}. Publish a ` +
        `canary of this exact commit and QA it on the store build before going to production.`
    )
  }

  return { ok: failures.length === 0, failures }
}
