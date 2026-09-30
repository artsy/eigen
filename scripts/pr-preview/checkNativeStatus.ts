/**
 * Decides whether a PR is ahead of, behind, or level with main on native code, so the PR preview
 * workflow knows whether it can publish a bundle.
 *
 * Usage:
 *   yarn tsx scripts/pr-preview/checkNativeStatus.ts fingerprint [--out <file>]
 *   yarn tsx scripts/pr-preview/checkNativeStatus.ts status --base <hash> --pr <hash> [--main <hash>]
 */
import { execFileSync, execSync } from "child_process"
import { appendFileSync, existsSync, mkdirSync, writeFileSync } from "fs"
import { dirname, join, resolve } from "path"
import { checkNativeStatus, formatGithubOutputs, parseFingerprint } from "./nativeStatus"

const REPO_ROOT = resolve(__dirname, "../..")
const LATEST_FINGERPRINT_URL = "s3://mobile-cached-builds/eigen-expo-fingerprint/latest.txt"

// computes fingerprint of the current checkout
const computeLocalFingerprint = () => {
  // Without node_modules, @expo/fingerprint silently skips the autolinking sources and returns a different hash.
  if (!existsSync(join(REPO_ROOT, "node_modules"))) {
    throw new Error("node_modules is missing; run the full setup before computing the fingerprint")
  }

  const output = execSync(
    "set -o pipefail && npx @expo/fingerprint fingerprint:generate | jq -r '.hash'",
    {
      cwd: REPO_ROOT,
      encoding: "utf8",
      shell: "/bin/bash",
      stdio: ["ignore", "pipe", "inherit"],
    }
  )

  return parseFingerprint({ value: output, label: "Local fingerprint" })
}

const readMainFingerprint = () => {
  const output = execFileSync("aws", ["s3", "cp", LATEST_FINGERPRINT_URL, "-"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  })

  return parseFingerprint({ value: output, label: "latest.txt" })
}

const COMMANDS = ["fingerprint", "status"] as const
type Command = (typeof COMMANDS)[number]

const isCommand = (value: string | undefined): value is Command =>
  COMMANDS.some((command) => command === value)

/** Reads `--name <value>` from the args. Undefined when the flag isn't passed at all. */
const readFlag = ({ args, name }: { args: readonly string[]; name: string }) => {
  const index = args.indexOf(`--${name}`)
  if (index === -1) return undefined

  const value = args[index + 1]
  if (value === undefined || value.startsWith("--")) {
    throw new Error(`--${name} needs a value`)
  }
  return value
}

const writeGithubOutputs = (record: Readonly<Record<string, string>>) => {
  const outputPath = process.env.GITHUB_OUTPUT
  if (outputPath) {
    appendFileSync(outputPath, formatGithubOutputs(record))
  }
}

const runFingerprint = (args: readonly string[]) => {
  const out = readFlag({ args, name: "out" })
  const fingerprint = computeLocalFingerprint()

  if (out) {
    mkdirSync(dirname(out), { recursive: true })
    writeFileSync(out, `${fingerprint}\n`)
  }

  // stdout is the command's result, so workflows can capture it with $(...)
  console.log(fingerprint)
  writeGithubOutputs({ fingerprint })
}

const runStatus = (args: readonly string[]) => {
  const base = parseFingerprint({ value: readFlag({ args, name: "base" }), label: "--base" })
  const pr = parseFingerprint({ value: readFlag({ args, name: "pr" }), label: "--pr" })
  const mainFlag = readFlag({ args, name: "main" })
  // An empty --main (e.g. from a failed step) is an error, not a reason to fall back to S3
  const main =
    mainFlag === undefined
      ? readMainFingerprint()
      : parseFingerprint({ value: mainFlag, label: "--main" })

  const result = {
    status: checkNativeStatus({ base, pr, main }),
    fp_base: base,
    fp_pr: pr,
    fp_main: main,
  }

  console.log(JSON.stringify(result, null, 2))
  writeGithubOutputs(result)
}

const run = (argv: readonly string[]) => {
  const [command, ...args] = argv

  if (!isCommand(command)) {
    throw new Error(`Unknown command "${command ?? ""}". Expected one of: ${COMMANDS.join(", ")}.`)
  }

  switch (command) {
    case "fingerprint":
      return runFingerprint(args)
    case "status":
      return runStatus(args)
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
