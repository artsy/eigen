/**
 * Writes the PR preview result into a managed block of the PR description.
 *
 * Reads everything from the environment, so the workflow never interpolates values into a shell line:
 *   GH_TOKEN, REPO, PR_NUMBER, STATUS, PUBLISH_RESULT, CHANNEL, SHA, FP_BASE, FP_PR, FP_MAIN, RUN_URL,
 *   RUNTIME_PR, RUNTIME_MAIN
 *
 * Usage:
 *   yarn tsx scripts/pr-preview/updatePrDescription.ts
 */
import { execFileSync } from "child_process"
import {
  buildPreviewReport,
  isNativeStatus,
  isPublishResult,
  parsePullRequestBody,
  upsertPreviewBlock,
} from "./prDescription"

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

const run = () => {
  const pullRequestPath = `repos/${readEnv("REPO")}/pulls/${readEnv("PR_NUMBER")}`

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

  const currentBody = parsePullRequestBody(
    execFileSync("gh", ["api", pullRequestPath], { encoding: "utf8" })
  )
  const body = upsertPreviewBlock({ body: currentBody, report })

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

try {
  run()
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}
