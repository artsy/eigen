// Writes the suite's failed tests to $AD_FAILURES_PATH as JSON so
// scripts/ci/report-agent-device-test-failure can report them to Slack.
import fs from "node:fs"
import path from "node:path"

export default function createReporter() {
  return {
    name: "artsy-failures",
    onSuiteEnd(suite) {
      const outputPath = process.env.AD_FAILURES_PATH
      if (!outputPath) {
        return
      }

      const failures = suite.tests
        .filter((test) => test.status === "failed")
        .map((test) => ({
          file: test.file,
          title: test.title ?? path.basename(test.file),
          message: test.error?.message ?? "Unknown test failure",
          artifactsDir: test.artifactsDir,
        }))

      fs.mkdirSync(path.dirname(outputPath), { recursive: true })
      fs.writeFileSync(outputPath, JSON.stringify(failures, null, 2))
    },
  }
}
