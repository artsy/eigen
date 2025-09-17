#!/usr/bin/env node
/// <reference types="node" />
// @ts-check
"use strict"

import { resolve } from "path"
import Octokit, { PullsGetResponse } from "@octokit/rest"
import chalk from "chalk"
import { config } from "dotenv"
import { hideBin } from "yargs/helpers"
import yargs from "yargs/yargs"

config({ path: resolve(__dirname, "../../.env.releases") })

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

const SECTIONS = [
  "Cross-platform user-facing changes",
  "iOS user-facing changes",
  "Android user-facing changes",
  "Dev changes",
]

async function getPrsBetweenTags(tag1: string, tag2: string): Promise<PullsGetResponse[]> {
  const compare = await octokit.repos.compareCommits({
    owner: "artsy",
    repo: "eigen",
    base: tag1,
    head: tag2,
  })

  const prs: PullsGetResponse[] = []
  for (const commit of compare.data.commits) {
    const match = commit.commit.message.match(/\(#(\d+)\)/m)
    if (match) {
      const prNumber = parseInt(match[1], 10)
      const pr = await octokit.pulls.get({
        owner: "artsy",
        repo: "eigen",
        pull_number: prNumber,
      })
      prs.push(pr.data)
    }
  }
  return prs
}

const parseSectionChanges = (content: string) => {
  const entries = content.split("\n")

  // Remove section title (e.g `#### iOS user-facing changes`)
  entries.splice(0, 1)

  const trimmedEntries = entries.map((entry) => entry.trim())
  const filledEntries = trimmedEntries.filter((entry) => {
    const isNotEmpty = entry.length > 0
    const isNotEntryDelimiter = entry !== "-"

    return isNotEmpty && isNotEntryDelimiter
  })

  return filledEntries
}

const parseSectionPositions = (section: string, body: string) => {
  const startSectionPosition = body.indexOf(`#### ${section}`)

  if (startSectionPosition === -1) {
    return null
  }

  let endSectionPosition = body.indexOf("####", startSectionPosition + 1)

  /**
   * If we didn't get the position of the next section,
   * it means that the current section is the **last** section.
   * Trying to get the position of the end of the block with changelog sections
   */
  if (endSectionPosition === -1) {
    endSectionPosition = body.indexOf("<!-- end_changelog_updates -->", startSectionPosition + 1)
  }

  if (startSectionPosition !== -1 && endSectionPosition !== -1) {
    return {
      start: startSectionPosition,
      end: endSectionPosition,
    }
  }

  return null
}

async function getChangelogFromPrs(prs: PullsGetResponse[]) {
  let changelog = ""
  const prsWithoutChangelog: PullsGetResponse[] = []
  const prsWithNoChangelog: PullsGetResponse[] = []
  for (const pr of prs) {
    // pr body without comments except <!-- end_changelog_updates --> (used in parseSectionPositions)
    const prBody = pr.body.replace(/<!--((?!end_changelog).)*-->/g, "")
    let prHasChangelog = false
    for (const section of SECTIONS) {
      const positions = parseSectionPositions(section, prBody)
      if (positions !== null) {
        const sectionContent = prBody.slice(positions.start, positions.end)
        const sectionChanges = parseSectionChanges(sectionContent)
        for (let entry of sectionChanges) {
          const authorName = pr.user.login
          entry = `${entry} - ${authorName}`
          changelog += `${entry} : ${section} : PR #${pr.number}\n`
          prHasChangelog = true
        }
      }
    }
    if (!prHasChangelog) {
      prBody.toLocaleLowerCase().includes("#nochangelog")
        ? prsWithNoChangelog.push(pr)
        : prsWithoutChangelog.push(pr)
    }
  }
  return { changelog, prsWithoutChangelog, prsWithNoChangelog }
}

async function main() {
  const argv = yargs(hideBin(process.argv)).argv as any
  const tag1 = argv._[0]
  const tag2 = argv._[1]

  if (!tag1 || !tag2) {
    console.error(chalk.bold.red("Usage: yarn generateChangelog <tag1> <tag2>"))
    return
  }

  const prs = await getPrsBetweenTags(tag1, tag2)
  const { changelog, prsWithoutChangelog, prsWithNoChangelog } = await getChangelogFromPrs(prs)

  console.log(chalk.bold.greenBright("\nPRs with changelog entries:"))
  console.log(chalk.greenBright(changelog))

  console.log(chalk.bold.green("\nPRs with #nochangelog:"))
  for (const pr of prsWithNoChangelog) {
    console.log(chalk.green(`PR #${pr.number}: ${pr.title} - ${pr.user.login}`))
  }

  console.log(chalk.bold.yellow("\nPRs without changelog entries:"))
  for (const pr of prsWithoutChangelog) {
    console.log(chalk.yellow(`PR #${pr.number}: ${pr.title} - ${pr.user.login}`))
  }
}

main().catch((err) => console.error(err))
