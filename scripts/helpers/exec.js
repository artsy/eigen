// @ts-check
const { spawnSync } = require("child_process")

/**
 * @param {string} command
 */
const exec = (command) => {
  const task = spawnSync(command, { shell: true })
  if (task.status != 0) {
    console.log(task.stderr.toString())
  }
  return task.stdout.toString()
}

module.exports = {
  exec,
}
