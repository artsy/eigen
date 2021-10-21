import got from "got"
import _ from "lodash"
import { exec } from "./helpers"

const main = async () => {
  const jobsThatCouldBeCancelled = [
    // add more here if we need to cancel early for draft PRs
    "build-test-app-ios",
    "build-test-app-android",
  ]

  let willCancelSomeJobs = false

  const isPrDraft = ((await got
    .get(
      `https://api.github.com/repos/artsy/eigen/pulls/${
        process.env.CI ? _.last(process.env.CIRCLE_PULL_REQUEST.split("/")) : "a-gh-pr-number-for-debugging"
      }`,
      {
        headers: { Accept: "application/vnd.github.v3+json" },
      }
    )
    .json()) as any).draft

  if (isPrDraft) {
    willCancelSomeJobs = true
    console.log("We will cancel some jobs")
  }

  if (!willCancelSomeJobs) {
    // nothing to be done. we just continue with the rest of the workflow.
    process.env.CI ? exec("circleci step halt") : process.exit(0)
  }

  // we get the current jobs
  const jobs = ((await got
    .get(
      `https://circleci.com/api/v2/workflow/${
        process.env.CI ? process.env.CIRCLE_WORKFLOW_ID : "a-workflow-id-for-debugging"
      }/job`
      // { headers: { "Circle-Token": "a-personal-token-for-debugging" } }
    )
    .json()) as any).items.map((i) => ({ name: i.name, job_number: i.job_number }))

  // we will cancel the following jobs
  const jobsToBeCancelled = jobs.filter((i) => jobsThatCouldBeCancelled.includes(i.name))
  jobsToBeCancelled.forEach(async (i) => {
    await got.post(`https://circleci.com/api/v2/project/gh/artsy/eigen/job/${i.job_number}/cancel`)
  })
}

main()
