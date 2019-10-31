// @ts-check
// basic idea came from https://github.com/bellkev/circle-lock-test

const fetch = require("node-fetch").default
const chalk = require("chalk").default
const { throttle } = require("lodash")

/**
 * Returns a promise that resolves once all previous circleCI builds on the current branch
 * have finished (or failed for whatever reason).
 * @param {{pollInterval?: number, logInterval?:number}?} props
 */
async function awaitPreviousBuilds({ pollInterval = 5000, logInterval = 30000 } = {}) {
  const { CIRCLE_TOKEN, CIRCLE_BRANCH, CIRCLECI } = process.env

  if (CIRCLECI !== "true") {
    throw new Error("awaitPreviousBuilds only works on CI")
  }

  if (!CIRCLE_TOKEN) {
    throw new Error(
      "Please add CIRCLE_TOKEN in env. Must have read access for the project. See https://circleci.com/docs/api/#authentication (make sure it's scope: all)"
    )
  }

  const notifyAboutWaiting = throttle(({ numActiveBuilds }) => {
    console.log(chalk.cyan(`⏱ Waiting for ${numActiveBuilds} previous build(s) on ${CIRCLE_BRANCH} to finish...`))
  }, logInterval)

  while (true) {
    const numActiveBuilds = await getNumberOfPreviousActiveBuilds()

    if (numActiveBuilds === 0) {
      console.log(chalk.cyan(`✨ Previous builds on ${CIRCLE_BRANCH} have all finished!`))
      return
    }

    notifyAboutWaiting({ numActiveBuilds })

    await new Promise(r => setTimeout(r, pollInterval))
  }
}

async function getNumberOfPreviousActiveBuilds() {
  const {
    CIRCLE_BRANCH,
    CIRCLE_BUILD_NUM,
    CIRCLE_PROJECT_REPONAME,
    CIRCLE_PROJECT_USERNAME,
    CIRCLE_TOKEN,
  } = process.env

  const res = await fetch(
    `https://circleci.com/api/v1/project/${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}?circle-token=${CIRCLE_TOKEN}&limit=100`,
    { headers: { Accept: "application/json" } }
  )
  if (res.status >= 400) {
    throw new Error("Failed to fetch circle build data")
  }
  const data = await res.json()
  const activeBuilds = data
    .filter(
      build =>
        build.branch === CIRCLE_BRANCH &&
        build.build_num < Number(CIRCLE_BUILD_NUM) &&
        build.status.match(/^(running|pending|queued)$/)
    )
    .map(({ branch, build_num, status }) => ({ branch, build_num, status }))

  return activeBuilds.length
}

module.exports = awaitPreviousBuilds
