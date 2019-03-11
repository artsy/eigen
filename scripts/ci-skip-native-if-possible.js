// @ts-check

/*
Welcome to the weirdest script. It is used CI runs to skip builds that have no native code changes.
The script will *fail* if there are changes, and *pass* in all other cases (including script failures).

Use it with bash short-circuiting:

> yarn ci:skip-native-if-possible || do_expensive_ci_work
*/

const spawnSync = require("child_process").spawnSync

/// same as sh but returns "" for failed commands.
function reverseSh(command) {
  console.log("$ " + command)
  const task = spawnSync(command, { shell: true })
  if (task.status != 0) {
    console.error(`[!] Failed to run command. Purposefully not failing to ensure native CI runs. ${command}`)
    return ""
  }
  return task.stdout.toString()
}

const branch = process.env["CIRCLE_BRANCH"]

if (branch === "master") {
  throw new Error("Not skipping a build on master.")
}

/** @type {String[]} */
const changedFiles = reverseSh(`git diff --name-only HEAD master`).split("\n")
if (changedFiles.filter(file => file.startsWith("Pod/") || file.startsWith("Example/")).length > 0) {
  throw new Error("Native files have been changed, not skipping.")
}
