#!/usr/bin/env node

// @ts-check


const spawnSync = require("child_process").spawnSync

function sh(command, cwd) {
 console.log("$ " + command)
 const task = spawnSync(command, { shell: true, cwd })
 if (task.status != 0) {
   throw new Error("[!] " + command)
 }
 return task.stdout.toString()
}

sh("echo wow!")
sh("touch testfile")
sh("cat CHANGELOG.branch.yml > testfile")
sh("git add testfile")
sh("cp CHANGELOG.branch.tmp.yml CHANGELOG.branch.yml")
sh("git add CHANGELOG.branch.yml")
// sh("git commit -m 'merge changelog'")
