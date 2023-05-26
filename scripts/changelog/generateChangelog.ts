#!/usr/bin/env node
/// <reference types="node" />
// @ts-check
"use strict"

import Octokit, { PullsGetResponse } from "@octokit/rest"
import { hideBin } from "yargs/helpers"
import yargs from "yargs/yargs"

const octokit = new Octokit({ auth: process.env.CHANGELOG_GITHUB_TOKEN_KEY })

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

async function getChangelogFromPrs(prs: PullsGetResponse[]) {
  let changelog = ""
  const prsWithoutChangelog: PullsGetResponse[] = []
  for (const pr of prs) {
    const prBody = pr.body
    let prHasChangelog = false
    for (const section of [
      "Cross-platform user-facing changes",
      "iOS user-facing changes",
      "Android user-facing changes",
      "Dev changes",
    ]) {
      const sectionStart = prBody.indexOf(`#### ${section}`)
      if (sectionStart !== -1) {
        let sectionEnd = prBody.indexOf("####", sectionStart + 1)
        sectionEnd =
          sectionEnd !== -1
            ? sectionEnd
            : prBody.indexOf("<!-- end_changelog_updates -->", sectionStart + 1)
        if (sectionEnd !== -1) {
          const entries = prBody
            .slice(sectionStart, sectionEnd)
            .split("\n")
            .slice(1)
            .map((x) => x.trim())
            .filter((x) => x && x !== "-")
          for (const entry of entries) {
            changelog += `${entry} : ${section} : PR #${pr.number}\n`
            prHasChangelog = true
          }
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

  const prs = await getPrsBetweenTags(tag1, tag2)
  const { changelog, prsWithoutChangelog } = await getChangelogFromPrs(prs)

  console.log(changelog)

  console.log("\nPRs without changelog entries:")
  for (const pr of prsWithoutChangelog) {
    console.log(`PR #${pr.number}: ${pr.title}`)
  }
}

main().catch((err) => console.error(err))
