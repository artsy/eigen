import { resolve } from "path"
import { config } from "dotenv"
import { DateTime } from "luxon"

config({ path: resolve(__dirname, "../../.env.releases") })

import { extractChangelogFromPrBody, extractContributorsFromChangelog } from "./changelog"
import { QA_DESTINATION_URL, QA_TEMPLATE_URL } from "./constants"
import { duplicateTemplate, findExistingCopy } from "./duplicateNotionTemplate"
import { fetchWithTimeout } from "./notion"
import { getVersionFromBranch, isHotfixBranch } from "./version"

// Post via the release-lookout Slack bot (chat.postMessage), same auth model as
// release-lookout/src/release-reminders.ts. Best-effort and never fatal: the QA
// document is the deliverable, so a Slack outage must not fail the job (which
// would only report a false failure and, thanks to idempotency, keep failing on
// every re-run while Slack is down).
// Returns the posted message's `ts` (used to thread a follow-up reply under it),
// or undefined if the post was skipped/failed.
const postToSlack = async (text: string, threadTs?: string): Promise<string | undefined> => {
  const slackToken = process.env.SLACK_TOKEN ?? ""
  const slackChannel = process.env.SLACK_CHANNEL ?? ""
  if (!slackToken || !slackChannel) {
    console.warn("Missing SLACK_TOKEN or SLACK_CHANNEL; skipping Slack notification.")
    return undefined
  }
  try {
    const res = await fetchWithTimeout(
      "https://slack.com/api/chat.postMessage",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${slackToken}`,
        },
        body: JSON.stringify({
          channel: slackChannel,
          text,
          ...(threadTs ? { thread_ts: threadTs } : {}),
        }),
      },
      10_000
    )
    const body = await res.json().catch(() => null)
    if (!res.ok || !body?.ok) {
      console.warn(
        `Failed to send Slack message: ${res.status} ${res.statusText} ${body?.error ?? ""}`
      )
      return undefined
    }
    return body.ts
  } catch (error) {
    console.warn(`Failed to send Slack message: ${error}`)
    return undefined
  }
}

// Title fragments that identify an existing QA document as "the same QA round".
// They mirror the stamped template title:
//   "2026-MM-DD Mobile App QA (version A.B.C, iOS build 2026.W.X.Y.Z Android build XYZ)"
// - "version X.Y.Z," is anchored on the trailing comma so 9.22.1 can't match
//   9.22.10, and 9.22.0 can't match 9.22.0-hotfix.
// - The build numbers make a new beta for the same version get a fresh doc,
//   while a re-run for the same builds still reuses the existing one.
// - Without any build numbers (betas not tagged) we fall back to today's date.
export const qaDocumentMatchKeys = ({
  version,
  today,
  iosBuild,
  androidBuild,
}: {
  version: string
  today: string
  iosBuild?: string
  androidBuild?: string
}): string[] => {
  const keys = [`version ${version},`]
  if (iosBuild) keys.push(`iOS build ${iosBuild} `)
  if (androidBuild) keys.push(`Android build ${androidBuild})`)
  if (!iosBuild && !androidBuild) keys.push(today)
  return keys
}

// Triggered by the release-candidate pull request (head branch `rc-v<version>` or `rc-v<version>-hotfix`):
// duplicates the Mobile App QA Notion template with the release version and
// today's date stamped into the title, then posts the link to Slack.
export const createQaDocument = async (
  branch: string = process.env.RC_BRANCH ?? process.env.GITHUB_HEAD_REF ?? "",
  now: DateTime = DateTime.now()
): Promise<void> => {
  // Hotfix QA docs get a "-hotfix" suffix so they don't collide with the
  // original release's doc in the idempotency check below.
  const baseVersion = getVersionFromBranch(branch)
  const version = isHotfixBranch(branch) ? `${baseVersion}-hotfix` : baseVersion
  const today = now.toFormat("yyyy-MM-dd")

  // Build numbers are read from the beta git tags by the workflow and passed in
  // via env; empty when the betas haven't tagged yet (leaves the placeholder).
  const iosBuild = process.env.IOS_BUILD || undefined
  const androidBuild = process.env.ANDROID_BUILD || undefined

  // Changelog is lifted from the RC PR body (passed in via env). Best-effort:
  // a missing changelog must never block QA document creation.
  const changelog = extractChangelogFromPrBody(process.env.PR_BODY ?? "") ?? undefined

  // Idempotency: don't create a second doc if one for these exact builds
  // already exists (e.g. the RC PR was reopened or the job re-run). Either way
  // the channel just wants the link, so we announce it with the same message.
  const existing = await findExistingCopy(
    QA_DESTINATION_URL,
    qaDocumentMatchKeys({ version, today, iosBuild, androidBuild })
  )
  let url: string
  if (existing) {
    console.log(`QA document already exists: ${existing}`)
    url = existing
  } else {
    url = await duplicateTemplate(QA_TEMPLATE_URL, QA_DESTINATION_URL, {
      version,
      today,
      iosBuild,
      androidBuild,
      changelog,
    })
    console.log(`Successfully created QA document: ${url}`)
  }

  const parentTs = await postToSlack(
    `:notion: The mobile QA document for v${version} is available here: ${url}`
  )

  // Changelog goes as a threaded reply under the main announcement, rather than
  // in the same message, so the channel stays scannable when it's long. The
  // contributor handles are appended so the captain can see who to pull into
  // Recent Changes QA without reading every entry; plain handles, not Slack
  // mentions, since GitHub and Slack handles don't necessarily match.
  if (changelog) {
    const contributors = extractContributorsFromChangelog(changelog)
    const contributorsLine = contributors.length
      ? `\n\n*Contributors:* ${contributors.join(", ")}`
      : ""
    await postToSlack(`*Changelog*\n${changelog}${contributorsLine}`, parentTs)
  }
}

// Prevents auto-execution when imported in tests.
if (require.main === module) {
  createQaDocument().catch((error) => {
    console.error("Error creating QA document:", error)
    process.exit(1)
  })
}
