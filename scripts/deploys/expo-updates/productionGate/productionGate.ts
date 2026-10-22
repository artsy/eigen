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
  /**
   * The hour this publish will be tagged with, as digits: YYYYMMDDHH, in the runner's local time.
   *
   * Fastlane names the production tag after the hour and force-moves a tag that already exists, so
   * it has to be the same clock and the same format as `set_expo_release_values`.
   */
  currentHour: string
}

export interface GateResult {
  ok: boolean
  failures: string[]
}

/** A PR as `gh pr list --json number,baseRefName,state,isCrossRepository` reports it */
export interface PullRequestCandidate {
  number: number
  baseRefName: string
  state: string
  isCrossRepository: boolean
}

/**
 * The hotfix PR among the PRs `gh pr list --head <branch>` returned.
 *
 * `--head` matches on the branch name alone, so it also returns fork PRs whose head branch is
 * called the same. eigen is public, so anyone can open one, and it would otherwise pass the gate,
 * have its body copied into the release, and get commented on and linked from Slack. Only a PR
 * from this repository counts. Of those, the newest wins, so a stale PR from a reused branch name
 * doesn't.
 */
export const pickHotfixPullRequest = (
  candidates: PullRequestCandidate[]
): HotfixPullRequest | null => {
  const pr = candidates
    .filter((candidate) => !candidate.isCrossRepository)
    .sort((a, b) => b.number - a.number)[0]
  if (!pr) return null

  return { number: pr.number, baseRef: pr.baseRefName, merged: pr.state === "MERGED" }
}

/**
 * The hour a production tag was published in, as YYYYMMDDHH. Reads both tag formats: iOS ends in
 * `2026.10.01.09`, Android in `2026100109`.
 */
const tagHour = (tag: string) => {
  const match = tag.match(/(\d{4})\.?(\d{2})\.?(\d{2})\.?(\d{2})$/)
  return match ? match.slice(1).join("") : null
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

  // 6. No production update for this version has been published in this hour. The tag name only
  //    goes down to the hour and fastlane force-moves an existing tag, so a second publish would
  //    take over the first one's tag: its GitHub release would stop being creatable, point at the
  //    wrong commit, and count as one publish in the hotfix numbering.
  for (const platform of PLATFORMS) {
    const previous = context.previousProductionTags[platform]
    if (previous && tagHour(previous) === context.currentHour) {
      failures.push(
        `A production update was already published for ${context.version} this hour ` +
          `(${previous}). Publishing again now would reuse that tag and overwrite the record of ` +
          `the first one. Wait until the next hour. If the first one is bad, roll it back now.`
      )
      break
    }
  }

  return { ok: failures.length === 0, failures }
}

/** Start of a section that `start-hotfix` wrote into the hotfix PR body */
const SECTION_START = /^## (?=(?:Applied|Reverted) on top of )/m

/**
 * The commit a section was applied on top of, from its heading line only. Matching the heading
 * rather than the whole section matters: a section also lists its own commits in backticks, so the
 * tip that shipped appears in its own section's list and again in the next section's heading.
 *
 * Seven characters is git's minimum abbreviation, and keeps a stray short token from matching.
 */
const SECTION_BASE_SHA = /^## (?:Applied|Reverted) on top of `([0-9a-f]{7,40})`/

/**
 * The sections of the hotfix PR body that a production publish is shipping: everything
 * `start-hotfix` wrote since the last publish. That is usually one section, and more whenever
 * several fixes were applied before anyone published.
 *
 * Each heading records the commit its section was applied on top of. The previous production tag
 * points at the tip of the last section that shipped, which is the base of the first one that
 * hasn't. So the result starts at the section whose heading names that commit, or at the first
 * section when nothing has been published for this version yet.
 *
 * `publishedSha` is the full SHA of the previous production tag's commit. Headings hold an
 * abbreviation whose length depends on the clone that wrote it, so they're compared as a prefix.
 *
 * A heading nothing matches means the PR was hand-edited. Shipping every section is the safer way
 * to be wrong: it over-reports rather than hiding a fix that is going out.
 */
export const unpublishedHotfixSections = (body: string, publishedSha: string | null): string => {
  const sections = body
    .split(SECTION_START)
    .slice(1)
    .map((section) => `## ${section.trim()}`)
  if (sections.length === 0) return ""

  const published = publishedSha?.toLowerCase()
  const firstUnpublished = published
    ? sections.findIndex((section) => {
        const base = section.match(SECTION_BASE_SHA)?.[1]
        return base !== undefined && published.startsWith(base)
      })
    : 0

  return sections.slice(Math.max(firstUnpublished, 0)).join("\n\n")
}
