/**
 * Gathers the state a production Expo Update publish is happening in and checks it against the
 * rules in productionGate.ts. Fails the workflow before anything reaches users.
 *
 * There is no override. See docs/deploy_a_hotfix.md.
 *
 * Usage:
 *   yarn tsx scripts/deploys/expo-updates/productionGate/checkProductionGate.ts \
 *     --sha <sha> --branch <branch> --platform <all|ios|android>
 */
import { execFileSync } from "child_process"
import { appendFileSync, readFileSync } from "fs"
import { resolve } from "path"
import {
  checkProductionGate,
  GateContext,
  hotfixBranchFor,
  nextHotfixNumber,
  Platform,
  PLATFORMS,
  releaseBranchFor,
} from "./productionGate"

const REPO_ROOT = resolve(__dirname, "../../../..")
const REPO_URL = "https://github.com/artsy/eigen"

const run = (command: string, args: string[]) =>
  execFileSync(command, args, {
    cwd: REPO_ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  }).trim()

const tryRun = (command: string, args: string[]) => {
  try {
    return run(command, args)
  } catch {
    return null
  }
}

/** For commands that are expected to fail sometimes, so their noise doesn't look like a problem */
const tryRunSilently = (command: string, args: string[]) => {
  try {
    execFileSync(command, args, { cwd: REPO_ROOT, encoding: "utf8", stdio: "ignore" })
  } catch {
    // expected
  }
}

const readArg = (name: string) => {
  const index = process.argv.indexOf(`--${name}`)
  const value = index === -1 ? null : process.argv[index + 1]
  if (!value) throw new Error(`Missing required argument --${name}`)
  return value
}

const appJsonVersion = () =>
  JSON.parse(readFileSync(resolve(REPO_ROOT, "app.json"), "utf8")).version as string

/** Store submission tag for this version, e.g. ios-9.21.0-2026.03.11.18-submission */
const findSubmissionTag = (platform: Platform, version: string) => {
  const tags = tryRun("git", ["tag", "--list", `${platform}-${version}-*-submission`])
  if (!tags) return null
  return tags.split("\n").filter(Boolean).sort().pop() ?? null
}

/**
 * Every production OTA tag already published for this version, oldest first.
 *
 * Sorted by name rather than date: the tags are lightweight, so their "creation" date is the
 * commit's, and a tag that was force-pushed (two publishes in one hour) would sort wrongly. The
 * name ends in a zero-padded timestamp, so sorting it as text is both stable and chronological.
 */
const findProductionExpoTags = (platform: Platform, version: string) => {
  const tags = tryRun("git", ["tag", "--list", `${platform}-expo-production-${version}-*`])
  return tags ? tags.split("\n").filter(Boolean).sort() : []
}

const descendsFrom = (sha: string, tag: string) => {
  try {
    run("git", ["merge-base", "--is-ancestor", tag, sha])
    return true
  } catch {
    return false
  }
}

const findHotfixPullRequest = (branch: string) => {
  const output = tryRun("gh", [
    "pr",
    "list",
    "--head",
    branch,
    "--state",
    "all",
    "--json",
    "number,baseRefName,state",
    "--limit",
    "10",
  ])
  if (!output) return null

  const prs = JSON.parse(output) as {
    number: number
    baseRefName: string
    state: string
  }[]
  // Newest first, so a stale PR from a reused branch name doesn't win.
  const pr = prs.sort((a, b) => b.number - a.number)[0]
  if (!pr) return null

  return { number: pr.number, baseRef: pr.baseRefName, merged: pr.state === "MERGED" }
}

/**
 * Whether a canary Expo Update was published for this platform from this exact commit.
 *
 * Fastlane tags only after `eas update` succeeds, so the tag is the publish's own receipt.
 */
const hasCanaryTag = (platform: Platform, version: string, sha: string) => {
  const tags = tryRun("git", [
    "tag",
    "--list",
    `${platform}-expo-canary-${version}-*`,
    "--points-at",
    sha,
  ])
  return Boolean(tags)
}

const writeOutput = (key: string, value: string) => {
  const file = process.env.GITHUB_OUTPUT
  if (!file) return
  // Heredoc form, so multi-line values (the release notes) survive.
  const delimiter = `__${key}_${Date.now()}__`
  appendFileSync(file, `${key}<<${delimiter}\n${value}\n${delimiter}\n`)
}

/**
 * The newest "## Hotfix N" section of the hotfix PR, which start-hotfix wrote when it applied the
 * fix. Used as the body of the GitHub release, because `gh --generate-notes` comes back nearly
 * empty for cherry-picked commits — they aren't linked to their original PRs.
 */
const latestHotfixSection = (prNumber: number) => {
  const body = tryRun("gh", ["pr", "view", String(prNumber), "--json", "body", "--jq", ".body"])
  if (!body) return ""

  const sections = body.split(/^## (?=Hotfix )/m)
  const latest = sections.length > 1 ? sections[sections.length - 1] : ""
  return latest ? `## ${latest.trim()}` : ""
}

const main = () => {
  const sha = readArg("sha")
  const branch = readArg("branch")
  const platform = readArg("platform")
  const version = appJsonVersion()

  // Ancestry checks need real history. CI checks out at depth 1, where `merge-base --is-ancestor`
  // reports false for commits that are genuinely ancestors, which would fail every valid hotfix.
  //
  // Deepening is best-effort on purpose: `--unshallow` is a hard error on a repository that is
  // already complete, so it's tried rather than predicted. The checks below surface anything the
  // fetch failed to bring in, as a failure rather than a pass.
  tryRunSilently("git", ["fetch", "--quiet", "--unshallow", "--tags", "origin"])
  run("git", ["fetch", "--quiet", "--tags", "--force", "origin"])

  const submissionTags = {} as Record<Platform, string | null>
  const previousProductionTags = {} as Record<Platform, string | null>
  const allProductionTags = {} as Record<Platform, string[]>
  const ancestry: Record<string, boolean> = {}

  for (const candidate of PLATFORMS) {
    submissionTags[candidate] = findSubmissionTag(candidate, version)
    allProductionTags[candidate] = findProductionExpoTags(candidate, version)
    previousProductionTags[candidate] = allProductionTags[candidate].slice(-1)[0] ?? null

    for (const tag of [submissionTags[candidate], previousProductionTags[candidate]]) {
      if (tag) ancestry[tag] = descendsFrom(sha, tag)
    }
  }

  const context: GateContext = {
    version,
    branch,
    sha,
    platform,
    branchHeadSha: tryRun("git", ["rev-parse", `origin/${branch}`]) ?? "",
    hotfixPullRequest: findHotfixPullRequest(branch),
    submissionTags,
    previousProductionTags,
    descendsFrom: ancestry,
    canaryTags: {
      ios: hasCanaryTag("ios", version, sha),
      android: hasCanaryTag("android", version, sha),
    },
  }

  const result = checkProductionGate(context)

  if (!result.ok) {
    console.error("❌ This commit can't be published to production:\n")
    for (const failure of result.failures) console.error(`   • ${failure}`)
    console.error(
      `\nProduction Expo Updates are published from "${hotfixBranchFor(version)}", with a hotfix ` +
        `PR into "${releaseBranchFor(version)}" and a canary of the same commit. ` +
        `There is no override — see docs/deploy_a_hotfix.md.`
    )
    process.exit(1)
  }

  const hotfixNumber = nextHotfixNumber(allProductionTags.ios.length)
  const pullRequest = context.hotfixPullRequest

  writeOutput("hotfix_number", String(hotfixNumber))
  writeOutput("pr_number", pullRequest ? String(pullRequest.number) : "")
  writeOutput("version", version)
  writeOutput("release_title", `v${version} hotfix ${hotfixNumber} (OTA)`)
  // Falls back to the submission tag, so the first hotfix compares against what the store shipped.
  writeOutput("previous_ios_tag", previousProductionTags.ios ?? submissionTags.ios ?? "")
  writeOutput(
    "release_notes",
    [
      pullRequest
        ? `Published from [#${pullRequest.number}](${REPO_URL}/pull/${pullRequest.number}).`
        : "",
      pullRequest ? latestHotfixSection(pullRequest.number) : "",
    ]
      .filter(Boolean)
      .join("\n\n")
  )

  console.log(`✅ Production gate passed — this is hotfix ${hotfixNumber} for ${version}.`)
}

main()
