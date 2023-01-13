// @ts-check
const { spawnSync } = require("child_process")

/**
 * @param {string} command
 */
const exec = (command) => {
  const task = spawnSync(command, { shell: true })
  if (task.status != 0) {
    throw new Error(task.stderr.toString())
  }
  return task.stdout.toString()
}

module.exports = {
  exec,
}
