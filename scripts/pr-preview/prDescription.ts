import type { NativeStatus } from "./nativeStatus"
const NATIVE_STATUSES: readonly NativeStatus[] = ["level", "ahead", "behind"]

/** The `needs.<job>.result` values a finished job can have */
type PublishResult = "success" | "failure" | "cancelled" | "skipped"
const PUBLISH_RESULTS: readonly PublishResult[] = ["success", "failure", "cancelled", "skipped"]

export const isNativeStatus = (value: string): value is NativeStatus =>
  NATIVE_STATUSES.some((status) => status === value)

export const isPublishResult = (value: string): value is PublishResult =>
  PUBLISH_RESULTS.some((result) => result === value)

export const BLOCK_START = "<!-- pr-preview:start -->"
export const BLOCK_END = "<!-- pr-preview:end -->"

interface PreviewReportInput {
  status: NativeStatus
  publishResult: PublishResult
  channel: string
  sha: string
  fpBase: string
  fpPr: string
  fpMain: string
  runUrl: string
}

const fingerprintTable = (rows: ReadonlyArray<readonly [label: string, fingerprint: string]>) =>
  [
    "| | Fingerprint |",
    "| --- | --- |",
    ...rows.map(([label, fingerprint]) => `| ${label} | \`${fingerprint}\` |`),
  ].join("\n")

/** The text that goes inside the managed block of the PR description */
export const buildPreviewReport = ({
  status,
  publishResult,
  channel,
  sha,
  fpBase,
  fpPr,
  fpMain,
  runUrl,
}: PreviewReportInput) => {
  const heading = "### PR preview"

  if (status === "ahead") {
    return [
      heading,
      "> [!CAUTION]",
      "> This PR changes native code, so a JS bundle from it could crash builds that don't have that new native code.",
      "> Please deploy new betas instead.",
      "",
      fingerprintTable([
        ["PR", fpPr],
        ["Merge base with main", fpBase],
      ]),
    ].join("\n")
  }

  if (publishResult !== "success") {
    return [
      heading,
      "> [!CAUTION]",
      `> Publishing to \`${channel}\` failed. See the [workflow run](${runUrl}).`,
    ].join("\n")
  }

  const published = `Published \`${sha.slice(0, 7)}\` to the \`${channel}\` channel.`

  if (status === "behind") {
    return [
      heading,
      published,
      "",
      "> [!WARNING]",
      "> `main`'s native code has changed since this branch was created, so the bundle will run on a native build that's newer than the one this PR was written against",
      "> Rebase onto `main` to clear this warning.",
      "",
      fingerprintTable([
        ["PR (same as merge base)", fpPr],
        ["Main", fpMain],
      ]),
    ].join("\n")
  }

  return [heading, published].join("\n")
}

/** Replaces the managed block in `body`, or appends it when the body has none */
export const upsertPreviewBlock = ({ body, report }: { body: string; report: string }) => {
  const block = `${BLOCK_START}\n${report}\n${BLOCK_END}`
  const start = body.indexOf(BLOCK_START)
  const end = body.indexOf(BLOCK_END, start)

  if (start !== -1 && end !== -1) {
    return `${body.slice(0, start)}${block}${body.slice(end + BLOCK_END.length)}`
  }

  return body.trim() === "" ? block : `${body.trimEnd()}\n\n${block}`
}

/** Reads `body` from a GitHub "get pull request" response. GitHub sends null for an empty description. */
export const parsePullRequestBody = (json: string) => {
  const parsed: unknown = JSON.parse(json)

  if (typeof parsed === "object" && parsed !== null && "body" in parsed) {
    if (parsed.body === null) return ""
    if (typeof parsed.body === "string") return parsed.body
  }

  throw new Error("The pull request response has no body field")
}
