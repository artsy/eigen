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
 * Script to assign PBRW tickets to teams based on "Product Team:" field in ticket description
 *
 * This script:
 * 1. Fetches tickets from the "Define" column on the PBRW board
 * 2. Reads each ticket's description to find "Product Team:" field
 * 3. Adds the team name as a lowercase label to the ticket
 *
 * Usage: yarn assign-pbrw-tickets
 */

const JIRA_BASE_URL = process.env.JIRA_BASE_URL || "https://artsyproduct.atlassian.net"
const JIRA_EMAIL = process.env.JIRA_EMAIL
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN

if (!JIRA_EMAIL || !JIRA_API_TOKEN) {
  console.error(chalk.bold.red("Missing Jira credentials in environment variables."))
  console.error(
    chalk.bold.red(
      "Please set JIRA_EMAIL and JIRA_API_TOKEN in your environment or .env.releases file."
    )
  )
  process.exit(1)
}

interface JiraIssue {
  id: string
  key: string
  fields: {
    summary: string
    description?: any
    labels: string[]
  }
}

interface JiraSearchResponse {
  issues: JiraIssue[]
  total: number
  maxResults: number
  startAt: number
}

/**
 * Get the Basic Auth header for Jira API
 */
function getAuthHeader(): string {
  const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64")
  return `Basic ${auth}`
}

/**
 * Extract product team from ticket description
 */
function extractProductTeam(description: any): string | null {
  if (!description) return null

  try {
    // Handle different description formats (ADF or plain text)
    let descriptionText = ""

    if (typeof description === "string") {
      descriptionText = description
    } else if (description.content) {
      // ADF (Atlassian Document Format)
      descriptionText = extractTextFromADF(description)
    }

    // Look for "Product Team:" pattern (case insensitive)
    const productTeamMatch = descriptionText.match(/product\s+team:\s*([^\n\r]+)/i)

    if (productTeamMatch) {
      return productTeamMatch[1].trim().toLowerCase()
    }

    return null
  } catch (error) {
    console.warn(chalk.yellow(`Warning: Could not parse description: ${error}`))
    return null
  }
}

/**
 * Extract text content from Atlassian Document Format (ADF)
 */
function extractTextFromADF(adf: any): string {
  if (!adf || !adf.content) return ""

  let text = ""

  function traverse(node: any) {
    if (node.type === "text") {
      text += node.text
    } else if (node.content) {
      for (const child of node.content) {
        traverse(child)
      }
    }

    // Add line breaks for paragraph breaks
    if (node.type === "paragraph") {
      text += "\n"
    }
  }

  for (const content of adf.content) {
    traverse(content)
  }

  return text
}

/**
 * Fetch tickets from the "Define" column in the "Everything else" swimlane
 * This uses the board API to get tickets that are in the Define status
 */
async function fetchEverythingElseTickets(): Promise<JiraIssue[]> {
  try {
    console.log(chalk.blue("Fetching tickets from Define column in Everything else swimlane..."))

    // JQL to find tickets in PBRW project that are in Define column and might be in "Everything else" swimlane
    // We'll fetch tickets in Define status that don't have team labels
    const jql = `project = PBRW AND status = "Define" AND (assignee is EMPTY OR labels not in (sapphire, amber, diamond, emerald, onyx))`

    const response = await fetch(`${JIRA_BASE_URL}/rest/api/3/search`, {
      method: "POST",
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jql,
        fields: ["summary", "description", "labels"],
        maxResults: 200, // Adjust as needed
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Failed to fetch tickets: ${response.status} ${response.statusText}\n${errorText}`
      )
    }

    const data: JiraSearchResponse = await response.json()
    console.log(chalk.green(`Found ${data.issues.length} tickets to process`))

    return data.issues
  } catch (error) {
    console.error(chalk.bold.red("Error fetching tickets:"))
    console.error(error)
    throw error
  }
}

/**
 * Check if a ticket already has a team label assigned
 */
function hasExistingTeamLabel(labels: string[]): string | null {
  // Common team labels that might already be assigned
  const teamLabels = ["sapphire", "amber", "diamond", "emerald", "onyx"]

  for (const label of labels) {
    const normalizedLabel = label.toLowerCase()
    if (teamLabels.includes(normalizedLabel)) {
      return label
    }
  }

  return null
}

/**
 * Add a label to a Jira ticket
 */
async function addLabelToTicket(
  ticketKey: string,
  label: string,
  existingLabels: string[],
  isDryRun = false
): Promise<void> {
  try {
    // Don't add if label already exists
    if (existingLabels.includes(label)) {
      console.log(chalk.yellow(`Ticket ${ticketKey} already has label "${label}"`))
      return
    }

    if (isDryRun) {
      console.log(chalk.cyan(`[DRY RUN] Would add label "${label}" to ticket ${ticketKey}`))
      return
    }

    const newLabels = [...existingLabels, label]

    const response = await fetch(`${JIRA_BASE_URL}/rest/api/3/issue/${ticketKey}`, {
      method: "PUT",
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          labels: newLabels,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Failed to update ticket ${ticketKey}: ${response.status} ${response.statusText}\n${errorText}`
      )
    }

    console.log(chalk.green(`✓ Added label "${label}" to ticket ${ticketKey}`))
  } catch (error) {
    console.error(chalk.bold.red(`Error updating ticket ${ticketKey}:`))
    console.error(error)
  }
}

/**
 * Process a single ticket to extract and assign team label
 */
async function processTicket(ticket: JiraIssue, isDryRun = false): Promise<void> {
  console.log(chalk.blue(`Processing ticket ${ticket.key}: ${ticket.fields.summary}`))

  // Check if ticket already has a team label assigned
  const existingTeamLabel = hasExistingTeamLabel(ticket.fields.labels)
  if (existingTeamLabel) {
    console.log(
      chalk.yellow(`Ticket ${ticket.key} already has team label "${existingTeamLabel}" - skipping`)
    )
    return
  }

  const productTeam = extractProductTeam(ticket.fields.description)

  if (!productTeam) {
    console.log(chalk.yellow(`No "Product Team:" found in ${ticket.key}`))
    return
  }

  console.log(chalk.blue(`Found product team: "${productTeam}" for ${ticket.key}`))

  // Clean up team name to make it a valid label
  const labelName = productTeam
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-") // Replace invalid characters with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, "") // Remove leading/trailing hyphens

  if (labelName) {
    await addLabelToTicket(ticket.key, labelName, ticket.fields.labels, isDryRun)
  } else {
    console.log(
      chalk.yellow(`Could not create valid label from "${productTeam}" for ${ticket.key}`)
    )
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  try {
    console.log(chalk.bold.blue("Starting PBRW ticket team assignment for Define column..."))

    const tickets = await fetchEverythingElseTickets()

    if (tickets.length === 0) {
      console.log(chalk.yellow("No tickets found in Define column"))
      return
    }

    console.log(chalk.blue(`Processing ${tickets.length} tickets...`))

    // Process tickets sequentially to avoid rate limiting
    for (const ticket of tickets) {
      await processTicket(ticket, argv.dryRun)
      // Small delay to be respectful to the API
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    console.log(chalk.bold.green("✓ Completed processing all tickets"))
  } catch (error) {
    console.error(chalk.bold.red("Script failed:"))
    console.error(error)
    process.exit(1)
  }
}

// Handle command line arguments
const argv = yargs(hideBin(process.argv))
  .option("dry-run", {
    alias: "d",
    type: "boolean",
    description: "Run script without making changes",
    default: false,
  })
  .help().argv as any

if (argv.dryRun) {
  console.log(chalk.yellow("DRY RUN MODE: No changes will be made"))
}

// Run the script
main().catch((err) => {
  console.error(chalk.bold.red("Unhandled error:"))
  console.error(err)
  process.exit(1)
})
