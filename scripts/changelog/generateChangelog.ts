#!/usr/bin/env node
/// <reference types="node" />
// @ts-check
"use strict"

import { execSync } from "child_process"
import { resolve } from "path"
import Octokit, { PullsGetResponse } from "@octokit/rest"
import chalk from "chalk"
import { config } from "dotenv"
import prompts from "prompts"
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

type Platform = "ios" | "android"

function getGitTags(): string[] {
  const output = execSync("git tag --list --sort=-creatordate", { encoding: "utf-8" })
  return output.trim().split("\n").filter(Boolean)
}

function getSubmissionTags(platform: Platform): string[] {
  const allTags = getGitTags()
  return allTags.filter((tag) => tag.startsWith(`${platform}-`) && tag.endsWith("-submission"))
}

function getBetaTags(platform: Platform): string[] {
  const allTags = getGitTags()
  return allTags.filter(
    (tag) =>
      tag.startsWith(`${platform}-`) &&
      !tag.endsWith("-submission") &&
      !tag.includes("-expo-") &&
      !tag.includes("test")
  )
}

async function promptForSelection(
  options: string[],
  message: string,
  hint?: string
): Promise<string> {
  const displayCount = Math.min(options.length, 15)
  const choices = options.slice(0, displayCount).map((tag) => ({
    title: tag,
    value: tag,
  }))

  const response = await prompts(
    {
      type: "select",
      name: "value",
      message,
      hint: hint || "Use arrow keys to navigate, Enter to select",
      choices,
      initial: 0,
    },
    {
      onCancel: () => {
        console.log(chalk.red("\nCancelled"))
        process.exit(0)
      },
    }
  )

  return response.value
}

async function promptForPlatform(): Promise<Platform> {
  const response = await prompts(
    {
      type: "select",
      name: "value",
      message: "Select platform",
      hint: "Use arrow keys to navigate, Enter to select",
      choices: [
        { title: "iOS", value: "ios" },
        { title: "Android", value: "android" },
      ],
      initial: 0,
    },
    {
      onCancel: () => {
        console.log(chalk.red("\nCancelled"))
        process.exit(0)
      },
    }
  )

  return response.value
}

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
  let tag1 = argv._[0] as string | undefined
  let tag2 = argv._[1] as string | undefined

  // Interactive mode if no tags provided
  if (!tag1 || !tag2) {
    console.log(chalk.bold.magenta("\n🚀 Changelog Generator - Interactive Mode\n"))
    console.log(
      chalk.gray(
        "This tool generates a changelog between two git tags.\n" +
          "Typically you compare the last submission tag to a recent beta tag.\n"
      )
    )

    const platform = await promptForPlatform()

    const submissionTags = getSubmissionTags(platform)
    const betaTags = getBetaTags(platform)

    if (submissionTags.length === 0) {
      console.error(chalk.red(`No submission tags found for ${platform}`))
      return
    }

    if (betaTags.length === 0) {
      console.error(chalk.red(`No beta tags found for ${platform}`))
      return
    }

    tag1 = await promptForSelection(
      submissionTags,
      "Select BASE tag (last submission)",
      "This is the last app store release"
    )

    tag2 = await promptForSelection(
      betaTags,
      "Select HEAD tag (current beta)",
      "This is usually today's or recent beta build"
    )
  }

  console.log(chalk.bold.blue(`\n📋 Generating changelog: ${tag1} → ${tag2}\n`))

  const prs = await getPrsBetweenTags(tag1, tag2)

  if (prs.length === 0) {
    console.log(chalk.yellow("No PRs found between these tags."))
    return
  }

  const { changelog, prsWithoutChangelog, prsWithNoChangelog } = await getChangelogFromPrs(prs)

  console.log(chalk.bold.greenBright("\n✅ PRs with changelog entries:"))
  if (changelog) {
    console.log(chalk.greenBright(changelog))
  } else {
    console.log(chalk.gray("  (none)"))
  }

  console.log(chalk.bold.green("\n🏷️  PRs with #nochangelog:"))
  if (prsWithNoChangelog.length > 0) {
    for (const pr of prsWithNoChangelog) {
      console.log(chalk.green(`  PR #${pr.number}: ${pr.title} - ${pr.user.login}`))
    }
  } else {
    console.log(chalk.gray("  (none)"))
  }

  console.log(chalk.bold.yellow("\n⚠️  PRs without changelog entries:"))
  if (prsWithoutChangelog.length > 0) {
    for (const pr of prsWithoutChangelog) {
      console.log(chalk.yellow(`  PR #${pr.number}: ${pr.title} - ${pr.user.login}`))
    }
  } else {
    console.log(chalk.gray("  (none)"))
  }

  console.log(chalk.bold.blue(`\n📊 Summary: ${prs.length} total PRs`))
  console.log(
    chalk.gray(
      `   - With changelog: ${prs.length - prsWithoutChangelog.length - prsWithNoChangelog.length}`
    )
  )
  console.log(chalk.gray(`   - With #nochangelog: ${prsWithNoChangelog.length}`))
  console.log(chalk.gray(`   - Missing changelog: ${prsWithoutChangelog.length}`))
}

main().catch((err) => console.error(err))
