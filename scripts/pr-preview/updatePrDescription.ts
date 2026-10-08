/**
 * Writes the PR preview result into a managed block of the PR description, or resets the block to the
 * placeholder the PR template starts with.
 *
 * Reads everything from the environment, so the workflow never interpolates values into a shell line.
 *   report: GH_TOKEN, REPO, PR_NUMBER, STATUS, PUBLISH_RESULT, CHANNEL, SHA, FP_BASE, FP_PR, FP_MAIN,
 *           RUN_URL, RUNTIME_PR, RUNTIME_MAIN
 *   clear:  GH_TOKEN, REPO, PR_NUMBER
 *
 * Usage:
 *   yarn tsx scripts/pr-preview/updatePrDescription.ts report
 *   yarn tsx scripts/pr-preview/updatePrDescription.ts clear
 */
import { execFileSync } from "child_process"
import {
  buildPreviewReport,
  EMPTY_REPORT,
  isNativeStatus,
  isPublishResult,
  parsePullRequestBody,
  upsertPreviewBlock,
} from "./prDescription"

const COMMANDS = ["report", "clear"] as const
type Command = (typeof COMMANDS)[number]

const isCommand = (value: string | undefined): value is Command =>
  COMMANDS.some((command) => command === value)

const readEnv = (name: string) => {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} is not set`)
  }
  return value
}

const readEnumEnv = <T extends string>({
  name,
  isValid,
}: {
  name: string
  isValid: (value: string) => value is T
}) => {
  const value = readEnv(name)
  if (!isValid(value)) {
    throw new Error(`${name} has an unexpected value: "${value}"`)
  }
  return value
}

const updateBody = (transform: (currentBody: string) => string) => {
  const pullRequestPath = `repos/${readEnv("REPO")}/pulls/${readEnv("PR_NUMBER")}`

  const currentBody = parsePullRequestBody(
    execFileSync("gh", ["api", pullRequestPath], { encoding: "utf8" })
  )
  const body = transform(currentBody)

  if (body === currentBody) {
    console.log("PR description is already up to date")
    return
  }

  // The body goes in on stdin as JSON, so its size and quoting never reach the command line
  execFileSync("gh", ["api", "--method", "PATCH", pullRequestPath, "--input", "-"], {
    input: JSON.stringify({ body }),
    stdio: ["pipe", "ignore", "inherit"],
  })
  console.log("Updated the PR description")
}

const runReport = () => {
  const report = buildPreviewReport({
    status: readEnumEnv({ name: "STATUS", isValid: isNativeStatus }),
    publishResult: readEnumEnv({ name: "PUBLISH_RESULT", isValid: isPublishResult }),
    channel: readEnv("CHANNEL"),
    sha: readEnv("SHA"),
    fpBase: readEnv("FP_BASE"),
    fpPr: readEnv("FP_PR"),
    fpMain: readEnv("FP_MAIN"),
    runUrl: readEnv("RUN_URL"),
    prNumber: readEnv("PR_NUMBER"),
    runtimePr: readEnv("RUNTIME_PR"),
    runtimeMain: readEnv("RUNTIME_MAIN"),
  })

  updateBody((body) => upsertPreviewBlock({ body, report }))
}

const runClear = () => {
  updateBody((body) => upsertPreviewBlock({ body, report: EMPTY_REPORT }))
}

const run = (argv: readonly string[]) => {
  const [command] = argv

  if (!isCommand(command)) {
    throw new Error(`Unknown command "${command ?? ""}". Expected one of: ${COMMANDS.join(", ")}.`)
  }

  switch (command) {
    case "report":
      return runReport()
    case "clear":
      return runClear()
    default: {
      const _exhaustive: never = command
      return _exhaustive
    }
  }
}

try {
  run(process.argv.slice(2))
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}
