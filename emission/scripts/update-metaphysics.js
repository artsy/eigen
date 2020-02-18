// @ts-check

/**
 * @typedef {{owner: string, repo: string}} Repo
 */

const fs = require("fs")
const tmp = require("tmp")
const path = require("path")
const spawnSync = require("child_process").spawnSync
const chalk = require("chalk").default
const Octokit = require("@octokit/rest")
const awaitPreviousBuilds = require("./await-previous-builds")

async function main() {
  try {
    await awaitPreviousBuilds()
    await updateRepo({
      repo: { owner: "artsy", repo: "metaphysics" },
      branch: "update-emission-query-map",
      message: "Update emission query map",
      update: dir => {
        log.step("Merging complete.queryMap.json")
        // merge metaphysics into emission map first, to preserve any manual edits made in MP
        mergeJson("data/complete.queryMap.json", path.join(dir, "src/data/complete.queryMap.json"))
        // then merge back into metaphysics to update
        mergeJson(path.join(dir, "src/data/complete.queryMap.json"), "data/complete.queryMap.json")
      },
    })
  } catch (e) {
    if (e instanceof ShellError) {
      console.error(chalk.red(e.message))
    } else {
      console.error(e)
    }
    process.exit(1)
  }
}

/**
 * @param {{repo: Repo, branch: string, message: string, update: (dir: string) => void}} props
 */
async function updateRepo({ repo, branch, message, update }) {
  log.task(`Updating ${repo.owner}/${repo.repo}`)

  const dirHandle = tmp.dirSync({ unsafeCleanup: true })
  const dir = dirHandle.name

  try {
    await _updateRepo({ repo, branch, message, update, dir })
    log.success(`${repo.owner}/${repo.repo} is up to date!`)
  } finally {
    dirHandle.removeCallback()
  }
}

/**
 * @param {{repo: Repo, branch: string, message: string, update: (dir: string) => void, dir: string}} props
 */
async function _updateRepo({ repo, branch, message, update, dir }) {
  log.step("Cloning repo")
  clone({ repo, dir })
  await forceCheckout({ branch, dir, repo })

  update(dir)

  log.step("Checking for changes")
  if (!hasChanges(dir)) {
    log.substep(`Repo remains unchanged so no further action required :)`)
    return
  }

  log.step("Pushing changes")
  push({ dir, branch, message })

  if (await pullRequestAlreadyExists({ repo, branch })) {
    log.step(`PR for branch ${branch} already exists so there's nothing left to do :)`)
    return
  }

  log.step("Creating and merging pull request")
  await createAndMergePullRequest({
    repo,
    branch,
    title: message,
  })
}

/**
 * @param {{repo: Repo, dir: string}} props
 */
function clone({ repo, dir }) {
  exec(`git clone git@github.com:${repo.owner}/${repo.repo} ${dir}`, process.cwd())
}

/**
 * @param {{dir: string, branch: string, message: string}} props
 */
function push({ dir, branch, message }) {
  exec(`git commit -am '${message}'`, dir)
  exec(`git push origin ${branch} --force --no-verify`, dir)
}

/**
 * executes command in a shell
 * @param {string} command
 * @param {string} cwd
 */
function exec(command, cwd) {
  log.substep(command)
  const task = spawnSync(command, { shell: true, cwd })
  if (task.status != 0) {
    throw new ShellError(command, task.stderr.toString())
  }
  return task.stdout.toString()
}

class ShellError extends Error {
  /**
   * @param {string} command
   * @param {string} output
   */
  constructor(command, output) {
    super(`Failed running command '${command}' \n\n${prefixLines(output, "  ")}`)
    this.command = command
    this.output = output
  }
}

/**
 * @param {{branch: string, repo: Repo}} props
 */
async function pullRequestAlreadyExists({ branch, repo }) {
  const octokit = new Octokit({
    auth: process.env.GH_TOKEN,
  })
  const res = await octokit.pulls.list({
    ...repo,
    state: "open",
  })
  return res.data.some(pr => pr.head.ref === branch)
}

/**
 * makes a PR on MP for the given branch
 * @param {{repo: Repo, branch: string, title: string}} props
 */
async function createAndMergePullRequest({ repo, branch, title }) {
  const octokit = new Octokit({
    auth: process.env.GH_TOKEN,
  })
  log.substep("Creating initial PR")
  const res = await octokit.pulls.create({
    ...repo,
    head: branch,
    base: "master",
    title: title,
    body: "Greetings human :robot: This PR was created as part of emission's automated deployment.",
  })
  log.substep("Adding artsyit as an assignee to appease peril")
  await octokit.issues.addAssignees({
    ...repo,
    issue_number: res.data.number,
    assignees: ["artsyit"],
  })
  log.substep("Adding 'Merge On Green' label")
  await octokit.issues.addLabels({
    ...repo,
    issue_number: res.data.number,
    labels: ["Merge On Green"],
  })
}

/**
 * merges fileB into fileA
 * @param {string} fileA
 * @param {string} fileB
 */
function mergeJson(fileA, fileB) {
  const jsonA = JSON.parse(fs.readFileSync(fileA).toString())
  const jsonB = JSON.parse(fs.readFileSync(fileB).toString())
  fs.writeFileSync(fileA, JSON.stringify(Object.assign(jsonA, jsonB), null, "  "))
}

/**
 * Puts prefix at the start of every line of text
 * @param {string} text
 * @param {string} prefix
 */
function prefixLines(text, prefix) {
  return prefix + text.split("\n").join(`\n${prefix}`)
}

const log = {
  /**
   * @param {string} str
   */
  task: str => console.log(chalk.green("\n::"), chalk.bold(str), chalk.green("::\n")),
  /**
   * @param {string} str
   */
  step: str => console.log(chalk.cyan(`•`), str),
  /**
   * @param {string} str
   */
  substep: str => console.log(chalk.grey("  " + str)),
  /**
   * @param {string} str
   */
  success: str => console.log("\n" + chalk.green(`✔`), chalk.bold(str)),
}

/**
 * Checks out the branch, creating it if it doesn't already exist
 * @param {{branch: string, dir: string, repo: Repo}} param0
 */
async function forceCheckout({ branch, dir, repo }) {
  try {
    exec(`git checkout ${branch}`, dir)

    // if there isn't a current PR then reset to latest master
    if (!(await pullRequestAlreadyExists({ branch, repo }))) {
      exec(`git reset master --hard`, dir)
    }
  } catch (_) {
    exec(`git checkout -b ${branch}`, dir)
  }
}

/**
 * @param {string} dir
 */
function hasChanges(dir) {
  return exec("git status --porcelain", dir) !== ""
}

main()
