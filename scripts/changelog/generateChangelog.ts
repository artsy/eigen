#!/usr/bin/env node
/// <reference types="node" />
// @ts-check
"use strict"

import Octokit, { PullsGetResponse } from "@octokit/rest"
import { hideBin } from "yargs/helpers"
import yargs from "yargs/yargs"

const octokit = new Octokit({ auth: process.env.CHANGELOG_GITHUB_TOKEN_KEY })

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
  for (const pr of prs) {
    const prBody = pr.body
    let prHasChangelog = false
    for (const section of SECTIONS) {
      const positions = parseSectionPositions(section, prBody)
      if (positions !== null) {
        const sectionContent = prBody.slice(positions.start, positions.end)
        const sectionChanges = parseSectionChanges(sectionContent)
        for (const entry of sectionChanges) {
          changelog += `${entry} : ${section} : PR #${pr.number}\n`
          prHasChangelog = true
        }
      }
    }
    if (!prHasChangelog) {
      prsWithoutChangelog.push(pr)
    }
  }
  return { changelog, prsWithoutChangelog }
}

async function main() {
  const argv = yargs(hideBin(process.argv)).argv as any
  const tag1 = argv._[0]
  const tag2 = argv._[1]

  if (!tag1 || !tag2) {
    console.error("Usage: yarn generateChangelog <tag1> <tag2>")
    return
  }

  const prs = await getPrsBetweenTags(tag1, tag2)
  const { changelog, prsWithoutChangelog } = await getChangelogFromPrs(prs)

  console.log(changelog)

  console.log("\nPRs without changelog entries:")
  for (const pr of prsWithoutChangelog) {
    console.log(`PR #${pr.number}: ${pr.title}`)
  }
}

main().catch((err) => console.error(err))
