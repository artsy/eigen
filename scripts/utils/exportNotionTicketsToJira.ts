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
  console.error(chalk.bold.red("Usage: yarn notionFetch <databaseId>"))
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

async function createJiraIssue(issueSummary: string, issueDescription: string) {
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
            key: "APPL",
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
                    text: issueDescription,
                  },
                ],
              },
            ],
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
  } catch (error) {
    console.error(chalk.bold.red("Error creating Jira issue:"))
    console.error(error)
  }
}

async function main() {
  const notionData = await fetchNotionDatabase(databaseId)
  if (notionData && notionData.results) {
    for (const page of notionData.results) {
      const issueSummary = page.properties.Name.title[0]?.plain_text || "No Title"
      const notionPageUrl = page.url
      const issueDescription = `Auto-generated from mobile QA Notion card here: ${notionPageUrl}`
      await createJiraIssue(issueSummary, issueDescription)
    }
  }
}

main().catch((err) => console.error(chalk.bold.red(err)))
