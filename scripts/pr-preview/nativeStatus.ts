type Fingerprint = string & { readonly __type: "Fingerprint" }

/**
 * - `level`:  the PR fingerprint matches main's
 * - `ahead`:  the PR changed native code since it branched off
 * - `behind`: the PR didn't touch native code, but main did
 */
export type NativeStatus = "level" | "ahead" | "behind"

export interface Fingerprints {
  /** Fingerprint at merge-base(PR, main) */
  base: Fingerprint
  /** Fingerprint at the PR head */
  pr: Fingerprint
  /** Fingerprint of main (latest.txt) */
  main: Fingerprint
}

/** Same rule as `current_expo_fingerprint` in fastlane/utility_fastlane.rb */
const FINGERPRINT_PATTERN = /^[0-9a-f]{40}$/

const isFingerprint = (value: string): value is Fingerprint => FINGERPRINT_PATTERN.test(value)

/** Validates a value from outside the script (argv, S3, a file, command output) */
export const parseFingerprint = ({ value, label }: { value: unknown; label: string }) => {
  const trimmed = typeof value === "string" ? value.trim() : ""
  if (!isFingerprint(trimmed)) {
    throw new Error(`${label} is not a 40-character sha1 fingerprint: "${String(value ?? "")}"`)
  }
  return trimmed
}

/**
 * - `level`:  the PR fingerprint matches main's
 * - `ahead`:  the PR changed native code since it branched off
 * - `behind`: the PR didn't touch native code, but main did
 */
export const checkNativeStatus = ({ base, pr, main }: Fingerprints): NativeStatus => {
  if (pr === main) return "level"
  if (pr !== base) return "ahead"
  return "behind"
}

/**
 * Paths the fingerprint never reads. It hashes node_modules, ios/, android/, app.json, eas.json,
 * .gitignore and the autolinking config (see fingerprint.config.js), none of which live here.
 * Anything not listed counts as native, so a new config file can't slip past the check.
 */
const NON_NATIVE_PATH_PATTERNS = [/^src\//, /^data\//, /^docs\//, /\.md$/]

export const touchesNativeInputs = (paths: readonly string[]) => {
  return paths.some((path) => !NON_NATIVE_PATH_PATTERNS.some((pattern) => pattern.test(path)))
}

/** Lines in the `key=value` format that $GITHUB_OUTPUT expects */
export const formatGithubOutputs = (record: Readonly<Record<string, string>>) => {
  return Object.entries(record)
    .map(([k, v]) => `${k}=${v}\n`)
    .join("")
}
