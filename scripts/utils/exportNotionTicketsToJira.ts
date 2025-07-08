#!/usr/bin/env node
/// <reference types="node" />
// @ts-check
"use strict"

import { resolve } from "path"
import chalk from "chalk"
import { config } from "dotenv"
import { hideBin } from "yargs/helpers"
import yargs from "yargs/yargs"

config({ path: resolve(__dirname, "../../.env.releases") })

/**
 *
 * Convenience script for fetching notion cards from our mobile QA and creating Jira issues for them.
 * Usage: yarn export-notion-to-jira <databaseId>
 * To get the database id, go to the latest Mobile QA page, scroll to the bugs section,
 * click on the dots next to "Board View" and select "Copy Link".
 * The link should be of format: https://www.notion.so/artsy/<databaseId>?v=<version>&pvs=<pvs>
 *
 */

const NOTION_API_TOKEN = process.env.NOTION_API_TOKEN
const JIRA_BASE_URL = process.env.JIRA_BASE_URL
const JIRA_EMAIL = process.env.JIRA_EMAIL
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN

if (!NOTION_API_TOKEN) {
  console.error(chalk.bold.red("Missing NOTION_API_TOKEN in environment variables."))
  process.exit(1)
}

if (!JIRA_BASE_URL || !JIRA_EMAIL || !JIRA_API_TOKEN) {
  console.error(chalk.bold.red("Missing Jira credentials in environment variables."))
  process.exit(1)
}

const argv = yargs(hideBin(process.argv)).argv as any
const databaseId = argv._[0]

if (!databaseId) {
  console.error(chalk.bold.red("Usage: yarn export-notion-to-jira <databaseId>"))
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

async function createJiraIssue(issueSummary: string, issueLink: string, bugSeverity: string) {
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
          summary: issueSummary,
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
    console.log(chalk.bold.green("Successfully created Jira issue:"))
    console.log(JSON.stringify(data, null, 2))

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
}

const severityMap = {
  P1: "P1 - Critical",
  P2: "P2 - High",
  P3: "P3 - Moderate",
  P4: "P4 - Low",
  P5: "P5 - Informal",
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
      })
    }

    for (const issue of validIssues) {
      const issueKey = await createJiraIssue(issue.summary, issue.notionUrl, issue.severity)
      if (issueKey) {
        await updateJiraLabels(issueKey, [issue.team, "mobile"])
      }
    }
  }
}

main().catch((err) => console.error(chalk.bold.red(err)))
