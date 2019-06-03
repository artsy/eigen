// @ts-check

const fs = require("fs")
const path = require("path")
const spawnSync = require("child_process").spawnSync
const chalk = require("chalk")

function sh(command, cwd, opts) {
  console.log("$ " + command)
  const task = spawnSync(command, { shell: true, cwd })
  if (task.status != 0) {
    throw new Error("[!] " + command)
  }
  return task.stdout.toString()
}

const shMP = cmd => sh(cmd, mpDir)

console.log(chalk.green("=> Cloning a temporary copy of Metaphysics."))

const mpDir = "tmp/metaphysics"
sh("git clone https://github.com/artsy/metaphysics.git " + mpDir)

const queryMap = require("../data/complete.queryMap.json")
const mpQueryMapFilename = "tmp/metaphysics/src/data/complete.queryMap.json"

if (!fs.existsSync(mpQueryMapFilename)) {
  console.error("Couldn't read local metaphysics query map.")
  return 1
}

console.log(chalk.green("=> Creating new query JSON file."))
const mpQueryMap = JSON.parse(fs.readFileSync(mpQueryMapFilename))

// Merge all keys
for (const key in queryMap) {
  if (!mpQueryMap[key]) {
    mpQueryMap[key] = queryMap[key]
  }
}

fs.writeFileSync(mpQueryMapFilename, JSON.stringify(mpQueryMap, null, 2))

const status = shMP("git status")
const needsChanges = !status.includes("nothing to commit")
if (!needsChanges) {
  // There are no changes
  // Clean up tmp folder
  sh("rm -rf tmp")
} else {
  // There are querymap changes
  console.log(chalk.green("=> Creating a new branch and pushing."))

  // Make a random branch, and a quick func for scoping commands
  const branch = "query_" + Math.round(Math.random() * 100000)

  // Make a commit with the new querymap
  shMP("git add .")
  shMP("git commit -m 'Update emission querymap JSON'")
  shMP("git checkout -b " + branch)
  shMP("git push origin " + branch)

  // Open your browser
  console.log(chalk.green("=> Opening you into a PR"))
  sh("open https://github.com/artsy/metaphysics/pull/new/" + branch)

  // Clean up tmp folder
  sh("rm -rf tmp")
}
