#!/usr/bin/env node
"use strict"

/**
 * Generates an updated contributors list for docs/thanks.md
 *
 * Fetches all contributors with 100+ commits from GitHub, filters out bots,
 * and diffs against the existing thanks.md — only NEW contributors (not already
 * credited) are added. Existing entries are always preserved to avoid losing
 * credit for contributors whose commits may have been lost in repo history.
 *
 * Output: docs/thanks_updated.md
 *   - Existing entries from thanks.md (unchanged)
 *   - Followed by a clearly marked section of newly discovered contributors
 *
 * Usage:
 *   yarn tsx scripts/utils/generate-contributors.ts
 *
 * Optional env vars:
 *   GITHUB_TOKEN - Personal access token for higher rate limits (recommended)
 */

import * as fs from "fs"
import { resolve } from "path"
import * as path from "path"
import { config } from "dotenv"

config({ path: resolve(__dirname, "../../.env.releases") })

const REPO = "artsy/eigen"
const MIN_COMMITS = 100
const THANKS_FILE = path.resolve(__dirname, "../../docs/thanks.md")
const OUTPUT_FILE = path.resolve(__dirname, "../../docs/thanks_updated.md")

const BOT_PATTERNS = [/renovate/i, /dependabot/i, /\[bot\]/, /github-actions/i, /greenkeeper/i]

// Accounts that are bots/service accounts but don't self-identify as such
const MANUAL_BOT_LIST = new Set(["artsyit"])

const isBot = (login: string, type: string): boolean => {
  return (
    type === "Bot" ||
    BOT_PATTERNS.some((p) => p.test(login)) ||
    MANUAL_BOT_LIST.has(login.toLowerCase())
  )
}

interface GitHubContributor {
  login: string
  contributions: number
  type: string
}

interface GitHubUser {
  name: string | null
  login: string
  twitter_username: string | null
}

function makeHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "eigen-generate-contributors",
  }
  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`
  }
  return headers
}

async function fetchAllContributors(): Promise<GitHubContributor[]> {
  const all: GitHubContributor[] = []
  let page = 1

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const url = `https://api.github.com/repos/${REPO}/contributors?per_page=100&page=${page}&anon=false`
    const res = await fetch(url, { headers: makeHeaders() })

    if (!res.ok) {
      throw new Error(`GitHub API error ${res.status}: ${await res.text()}`)
    }

    const data = (await res.json()) as GitHubContributor[]
    if (data.length === 0) break

    all.push(...data)

    // Contributors are returned in descending order — stop once below threshold
    if (data[data.length - 1].contributions < MIN_COMMITS) break

    page++
  }

  return all
}

async function fetchUser(login: string): Promise<GitHubUser> {
  const res = await fetch(`https://api.github.com/users/${login}`, { headers: makeHeaders() })
  if (!res.ok) {
    throw new Error(`Failed to fetch user ${login}: ${res.status}`)
  }
  return res.json() as Promise<GitHubUser>
}

function formatLine(user: GitHubUser, commits: number): string {
  const name = user.name || user.login
  const github = `[${user.login}](https://github.com/${user.login})`
  const twitter = user.twitter_username
    ? ` - [@${user.twitter_username}](https://twitter.com/${user.twitter_username})`
    : ""
  return `- ${name} - ${github}${twitter} <!-- ${commits} commits -->`
}

/**
 * Extracts GitHub usernames (lowercase) from an existing thanks.md file.
 * Looks for markdown links of the form [username](https://github.com/username).
 */
function parseExistingUsernames(filePath: string): Set<string> {
  const content = fs.readFileSync(filePath, "utf-8")
  const matches = content.matchAll(/\(https?:\/\/github\.com\/([^)]+)\)/gi)
  return new Set([...matches].map((m) => m[1].toLowerCase()))
}

async function main() {
  if (!process.env.GITHUB_TOKEN) {
    console.warn(
      "⚠️  GITHUB_TOKEN not set — requests are rate-limited to 60/hour.\n" +
        "   Set GITHUB_TOKEN for a higher limit.\n"
    )
  }

  const existingUsernames = parseExistingUsernames(THANKS_FILE)
  console.log(`Found ${existingUsernames.size} existing contributors in thanks.md.`)

  console.log(`\nFetching contributors for ${REPO} with ${MIN_COMMITS}+ commits...`)
  const contributors = await fetchAllContributors()

  const eligible = contributors.filter(
    (c) => c.contributions >= MIN_COMMITS && !isBot(c.login, c.type)
  )
  console.log(`Found ${eligible.length} human contributors with ${MIN_COMMITS}+ commits.`)

  const newContributors = eligible.filter((c) => !existingUsernames.has(c.login.toLowerCase()))
  console.log(`\n${newContributors.length} are not yet in thanks.md — fetching their profiles...\n`)

  const newLines: string[] = []

  for (const contributor of newContributors) {
    process.stdout.write(
      `  Fetching profile: ${contributor.login} (${contributor.contributions} commits)... `
    )
    try {
      const user = await fetchUser(contributor.login)
      newLines.push(formatLine(user, contributor.contributions))
      console.log("✓")
    } catch (err) {
      console.log("⚠️  failed, using basic info")
      newLines.push(
        `- ${contributor.login} - [${contributor.login}](https://github.com/${contributor.login}) <!-- ${contributor.contributions} commits -->`
      )
    }

    // Be polite to the API
    await new Promise((r) => setTimeout(r, 150))
  }

  const existingContent = fs.readFileSync(THANKS_FILE, "utf-8").trimEnd()

  const output =
    newLines.length > 0
      ? [
          existingContent,
          "",
          "<!-- NEW CONTRIBUTORS — review and merge into the list above -->",
          ...newLines,
          "",
        ].join("\n")
      : existingContent + "\n"

  fs.writeFileSync(OUTPUT_FILE, output, "utf-8")

  if (newLines.length === 0) {
    console.log("\n✅ No new contributors found — thanks.md is up to date!")
  } else {
    console.log(`\n✅ Written to ${OUTPUT_FILE}`)
    console.log(`   ${newLines.length} new contributor(s) appended under the review comment.`)
    console.log("   Move them into the main list and update docs/thanks.md.")
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
