import { resolve } from "path"
import { config } from "dotenv"
import { DateTime } from "luxon"

config({ path: resolve(__dirname, "../../.env.releases") })

import { extractChangelogFromPrBody } from "./changelog"
import { QA_DESTINATION_URL, QA_TEMPLATE_URL } from "./constants"
import { duplicateTemplate, findExistingCopy } from "./duplicateNotionTemplate"
import { fetchWithTimeout } from "./notion"
import { getVersionFromBranch } from "./version"

// Post a simple message to Slack via the incoming webhook (same pattern as
// scripts/utils/exportNotionTicketsToJira.ts). Best-effort and never fatal: the
// QA document is the deliverable, so a Slack outage must not fail the job (which
// would only report a false failure and, thanks to idempotency, keep failing on
// every re-run while Slack is down).
const postToSlack = async (text: string): Promise<void> => {
  const slackUrl = process.env.SLACK_URL ?? ""
  if (!slackUrl) {
    console.warn("Missing SLACK_URL; skipping Slack notification.")
    return
  }
  try {
    const res = await fetchWithTimeout(
      slackUrl,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      },
      10_000
    )
    if (!res.ok) {
      console.warn(`Failed to send Slack message: ${res.status} ${res.statusText}`)
    }
  } catch (error) {
    console.warn(`Failed to send Slack message: ${error}`)
  }
}

// Triggered by the release-candidate pull request (head branch `rc-v<version>`):
// duplicates the Mobile App QA Notion template with the release version and
// today's date stamped into the title, then posts the link to Slack.
export const createQaDocument = async (
  branch: string = process.env.RC_BRANCH ?? process.env.GITHUB_HEAD_REF ?? "",
  now: DateTime = DateTime.now()
): Promise<void> => {
  const version = getVersionFromBranch(branch)
  const today = now.toFormat("yyyy-MM-dd")

  // Build numbers are read from the beta git tags by the workflow and passed in
  // via env; empty when the betas haven't tagged yet (leaves the placeholder).
  const iosBuild = process.env.IOS_BUILD || undefined
  const androidBuild = process.env.ANDROID_BUILD || undefined

  // Changelog is lifted from the RC PR body (passed in via env). Best-effort:
  // a missing changelog must never block QA document creation.
  const changelog = extractChangelogFromPrBody(process.env.PR_BODY ?? "") ?? undefined

  // Idempotency: don't create a second doc if one for this version already
  // exists (e.g. the RC PR was reopened or the job re-run). Either way the
  // channel just wants the link, so we announce it with the same message.
  const existing = await findExistingCopy(QA_DESTINATION_URL, [version])
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

  const changelogSection = changelog ? `\n\n*Changelog*\n${changelog}` : ""
  await postToSlack(
    `:notion: The mobile QA document for v${version} is available here: ${url}${changelogSection}`
  )
}

// Prevents auto-execution when imported in tests.
if (require.main === module) {
  createQaDocument().catch((error) => {
    console.error("Error creating QA document:", error)
    process.exit(1)
  })
}
