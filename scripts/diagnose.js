const { spawnSync } = require("child_process")
const chalk = require("chalk")
const checkDependencies = require("check-dependencies")
const fs = require("fs")

const exec = (command, cwd) => {
  const task = spawnSync(command, { shell: true, cwd })
  if (task.status != 0) {
    throw new Error(task.stderr.toString())
  }
  return task.stdout.toString()
}

const checkEnvVariables = () => {
  exec("touch .env.temp")
  exec("aws s3 cp s3://artsy-citadel/dev/.env.eigen .env.temp")

  const updatedEnv = fs.readFileSync("./.env.temp", "utf8").toString()
  const localEnv = fs.readFileSync("./.env.shared", "utf8").toString()

  if (updatedEnv !== localEnv) {
    console.log(`❌ Your .env.shared file does not match the one in AWS please run ${chalk.green("make artsy")}`)
  } else {
    console.log(`✅ Your env file seems to be valid`)
  }
  exec("rm .env.temp")
}

const checkNodeDependencies = async () => {
  const res = await checkDependencies()
  // Some dependencies do not match the specified version
  if (res.error.length) {
    // The last item is a suggestion on how to solve the error that is not useful for us
    res.error.pop()
    res.error.push(`Invoke ${chalk.green("yarn install")} to install missing packages`)
    res.error.forEach((error) => console.log(error))
  } else {
    console.log(`✅ Your dependencies match the ones specifed in package.json`)
  }
}

const main = async () => {
  // Check if the environment variables are up to date
  checkEnvVariables()
  // Check if any of the installed npm packages does not match the version in package.json
  await checkNodeDependencies()
}

main()
