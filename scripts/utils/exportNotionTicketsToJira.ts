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

if (!NOTION_API_TOKEN) {
  console.error(chalk.bold.red("Missing NOTION_API_TOKEN in environment variables."))
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
    console.log(chalk.bold.green("Successfully fetched Notion database:"))
    console.log(JSON.stringify(data, null, 2))
  } catch (error) {
    console.error(chalk.bold.red("Error fetching Notion database:"))
    console.error(error)
  }
}

async function main() {
  await fetchNotionDatabase(databaseId)
}

main().catch((err) => console.error(chalk.bold.red(err)))
