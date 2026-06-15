#!/usr/bin/env node
/// <reference types="node" />
// @ts-check
"use strict"

import { resolve } from "path"
import readline from "readline"
import chalk from "chalk"
import { config } from "dotenv"
import { hideBin } from "yargs/helpers"
import yargs from "yargs/yargs"

config({ path: resolve(__dirname, "../../.env.releases") })

/**
 *
 * Convenience script for fetching notion cards from our mobile QA and creating Jira issues for them.
 * Usage: yarn export-notion-to-jira <databaseId> --app <eigen|energy>
 * To get the database id, go to the latest Mobile QA page, scroll to the bugs section,
 * click on the dots next to "Board View" and select "Copy Link".
 * The link should be of format: https://www.notion.so/artsy/<databaseId>?v=<version>&pvs=<pvs>
 *
 */

const NOTION_API_TOKEN = process.env.NOTION_API_TOKEN
const JIRA_BASE_URL = process.env.JIRA_BASE_URL
const JIRA_EMAIL = process.env.JIRA_EMAIL
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN
const SLACK_URL = process.env.SLACK_URL

if (!NOTION_API_TOKEN) {
  console.error(chalk.bold.red("Missing NOTION_API_TOKEN in environment variables."))
  process.exit(1)
}

if (!JIRA_BASE_URL || !JIRA_EMAIL || !JIRA_API_TOKEN) {
  console.error(chalk.bold.red("Missing Jira credentials in environment variables."))
  process.exit(1)
}

const argv = yargs(hideBin(process.argv))
  .option("app", {
    describe: "App name to prepend to ticket titles",
    choices: ["eigen", "energy"],
    demandOption: true,
    type: "string",
  })
  .option("test-slack", {
    describe: "Preview and send the Slack message with dummy data without hitting Notion or Jira",
    type: "boolean",
    default: false,
  }).argv as any

const databaseId = argv._[0]
const appName = argv.app
const testSlack = argv["test-slack"]

if (!testSlack && !databaseId) {
  console.error(
    chalk.bold.red("Usage: yarn export-notion-to-jira <databaseId> --app <eigen|energy>")
  )
  process.exit(1)
}

async function fetchNotionDatabase(databaseId: string) {
  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_API_TOKEN}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch database: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log(chalk.bold.green("Successfully fetched Notion database"))
    return data
  } catch (error) {
    console.error(chalk.bold.red("Error fetching Notion database:"))
    console.error(error)
  }
}

async function createJiraIssue(
  issueSummary: string,
  issueLink: string,
  bugSeverity: string,
  appName: string
) {
  try {
    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64")
    const response = await fetch(`${JIRA_BASE_URL}/rest/api/3/issue`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          project: {
            key: "PBRW",
          },
          summary: `[${appName}] ${issueSummary}`,
          description: {
            type: "doc",
            version: 1,
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Auto-generated from mobile QA Notion card ",
                  },
                  {
                    type: "text",
                    text: "here",
                    marks: [
                      {
                        type: "link",
                        attrs: {
                          href: issueLink,
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
          customfield_10130: {
            value: bugSeverity, // Bug Severity
          },
          issuetype: {
            name: "Bug",
          },
        },
      }),
    })

    if (!response.ok) {
      console.log(await response.text())
      throw new Error(`Failed to create Jira issue: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const jiraUrl = `${JIRA_BASE_URL}/browse/${data.key}`
    console.log(
      chalk.bold.green(
        `Successfully created Jira issue: ${data.key} — [${appName}] ${issueSummary}`
      )
    )
    console.log(chalk.cyan(jiraUrl))

    return data.key
  } catch (error) {
    console.error(chalk.bold.red("Error creating Jira issue:"))
    console.error(error)
  }
}

async function updateJiraLabels(issueKey: string, labels: string[]) {
  try {
    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64")
    const response = await fetch(`${JIRA_BASE_URL}/rest/api/3/issue/${issueKey}`, {
      method: "PUT",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        update: {
          labels: labels.map((label) => ({ add: label })),
        },
      }),
    })

    if (!response.ok) {
      console.error(await response.text())
      throw new Error(
        `Failed to update labels for ${issueKey}: ${response.status} ${response.statusText}`
      )
    }

    console.log(chalk.bold.green(`Successfully updated labels for ${issueKey}`))
  } catch (error) {
    console.error(chalk.bold.red("Error updating Jira labels:"))
    console.error(error)
  }
}

interface ValidIssue {
  summary: string
  severity: string
  team: string
  notionUrl: string
  isLaunchBlocking: boolean
}

const severityMap = {
  P1: "P1 - Critical",
  P2: "P2 - High",
  P3: "P3 - Moderate",
  P4: "P4 - Low",
  P5: "P5 - Informal",
}

function formatLinkText(summary: string, maxLength = 80): string {
  const cleaned = `${appName} ${summary}`
    .replace(/[|<>]/g, "") // chars that break Slack's <url|text> mrkdwn format
    .trim()
  return cleaned.length > maxLength ? cleaned.slice(0, maxLength).trimEnd() + "…" : cleaned
}

function formatSlackLine(key: string, summary: string): string {
  return `:red_circle: - <${JIRA_BASE_URL}/browse/${key}|${formatLinkText(summary)}>`
}

function buildSlackMessage(lines: string): string {
  return `Thanks all for joining QA! We found the following launch blocking bugs which need volunteers - please shout if you want to work on any of them!\n${lines}`
}

function promptConfirm(question: string): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => {
    rl.question(`${question} (y/n): `, (answer) => {
      rl.close()
      resolve(answer.toLowerCase() === "y")
    })
  })
}

async function sendSlackMessage(text: string) {
  if (!SLACK_URL) {
    console.error(chalk.bold.red("Missing SLACK_URL in environment variables."))
    return
  }
  const response = await fetch(SLACK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  })
  if (!response.ok) {
    throw new Error(`Failed to send Slack message: ${response.status} ${response.statusText}`)
  }
  console.log(chalk.bold.green("Successfully sent Slack message"))
}

async function previewAndSend(slackMessage: string) {
  console.log(chalk.bold.cyan("\n--- Launch blocker Slack message preview ---"))
  console.log(slackMessage)
  console.log(chalk.bold.cyan("--------------------------------------------\n"))

  const shouldSend = await promptConfirm("Send this message to Slack?")
  if (shouldSend) {
    await sendSlackMessage(slackMessage)
  }
}

async function main() {
  const notionData = await fetchNotionDatabase(databaseId)
  if (notionData && notionData.results) {
    const validIssues: ValidIssue[] = []
    for (const page of notionData.results) {
      const issueSummary = page.properties.Name.title[0]?.plain_text || "No Title"
      const notionPageUrl = page.url

      const severity = page.properties["Bug Severity"]?.select?.name || null
      const team = page.properties.Team?.select?.name || null
      const status = page.properties.Status?.select?.name || null

      // 👇 Skip bugs that are marked as Fixed/Handled
      if (status === "Fixed/Handled") {
        console.log(chalk.yellow(`Skipping bug marked as Fixed/Handled: ${issueSummary}`))
        continue
      }

      if (!severity || !team) {
        console.error(chalk.bold.red("Missing Bug Severity or Team for page:"))
        console.error(chalk.bold.red(notionPageUrl))
        console.error(chalk.bold.red("Please fill in the missing fields and try again."))
        return
      }

      const fullSeverity = severityMap[severity as keyof typeof severityMap]
      validIssues.push({
        summary: issueSummary,
        severity: fullSeverity,
        team,
        notionUrl: notionPageUrl,
        isLaunchBlocking: status === "Launch Blocking",
      })
    }

    const launchBlockers: Array<{ key: string; summary: string }> = []

    for (const issue of validIssues) {
      const issueKey = await createJiraIssue(
        issue.summary,
        issue.notionUrl,
        issue.severity,
        appName
      )
      if (issueKey) {
        await updateJiraLabels(issueKey, [issue.team, "mobile"])
        if (issue.isLaunchBlocking) {
          launchBlockers.push({ key: issueKey, summary: issue.summary })
        }
      }
    }

    if (launchBlockers.length > 0) {
      const lines = launchBlockers
        .map(({ key, summary }) => formatSlackLine(key, summary))
        .join("\n")
      await previewAndSend(buildSlackMessage(lines))
    }
  }
}

if (testSlack) {
  const dummyBlockers = [
    {
      key: "PBRW-1894",
      summary: `Inbox → Active bids - I can see Complete Registration for the bid that closes on Juna 8 4 days ago.`,
    },
    { key: "PBRW-1895", summary: `Android Pill text is being cut` },
  ]
  const lines = dummyBlockers.map(({ key, summary }) => formatSlackLine(key, summary)).join("\n")
  previewAndSend(buildSlackMessage(lines)).catch((err) => console.error(chalk.bold.red(err)))
} else {
  main().catch((err) => console.error(chalk.bold.red(err)))
}
