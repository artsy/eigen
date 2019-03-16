// @ts-check

const fs = require("fs")
const path = require("path")
const spawnSync = require("child_process").spawnSync
const chalk = require("chalk")

const versionChange = process.argv[2]
if (!versionChange) {
  console.log("Usage: $ npm run release -- [patch|minor|major]")
  process.exit(1)
}

function sh(command, canFail = false) {
  console.log("$ " + command)
  const task = spawnSync(command, { shell: true })
  if (!canFail && task.status != 0) {
    console.log(String(task.stdout))
    console.error(chalk.red(String(task.stderr)))
    throw new Error("[!] " + command)
  }
}

function publishPodspec(podspec) {
  const podspecFilename = path.basename(podspec)
  const podspecDir = path.dirname(path.resolve(podspec))
  const packagePath = path.join(podspecDir, "package.json")

  const name = path.basename(podspec, ".podspec")
  const version = JSON.parse(fs.readFileSync(packagePath)).version

  const specRepo = path.join(process.env.HOME, ".cocoapods/repos/artsy")
  const relativeSpecPath = path.join(name, version, name + ".podspec.json")
  const specPath = path.join(specRepo, relativeSpecPath)

  if (!fs.existsSync(specPath)) {
    console.log("=> Pushing " + name + " podspec to spec-repo.")
    sh("mkdir -p " + path.dirname(specPath))
    sh("cd " + podspecDir + " && pod ipc spec " + podspecFilename + " > " + specPath)
    sh(
      "cd " +
        specRepo +
        " && git pull " +
        " && git add " +
        relativeSpecPath +
        ' && git commit -m "' +
        name +
        " " +
        version +
        '" && git push'
    )
  }
}

console.log(chalk.green("=> Validating your tools."))
sh("bundle --version")
sh("npm --version")

console.log(chalk.green("=> Creating release bundle."))
sh("npm run bundle")
sh("cd Example && bundle exec pod install && cd ..")
sh('git add . && git commit -m "[Pod] Update release artefacts."', true)

console.log(chalk.green("=> Creating version bump commit and tag."))
sh("npm version " + versionChange)

console.log(chalk.green("=> Updating Changelog"))
const changelog = fs.readFileSync("CHANGELOG.md", "utf8")
const newCHANGELOG = changelog.replace(
  "### Master",
  `### Master

### ${JSON.parse(fs.readFileSync("package.json", "utf8")).version}
`
)
fs.writeFileSync("CHANGELOG.md", newCHANGELOG, "utf8")
sh("git add CHANGELOG.md")
sh("git commit -m 'Updated CHANGELOG for new release'")

sh("git push")
sh("git push --tags")

console.log(chalk.green("=> Pushing Podspec"))
publishPodspec("Emission.podspec")

console.log(chalk.green("=> Updating Metaphysics"))
sh("npm run merge-graphql-query-map")
