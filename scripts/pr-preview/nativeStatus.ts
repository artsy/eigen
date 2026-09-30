type Fingerprint = string & { readonly __type: "Fingerprint" }

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
 * level:  the PR fingerprint matches main's
 * ahead:  the PR changed native code since it branched off
 * behind: the PR didn't touch native code, but main did
 */
export const checkNativeStatus = ({ base, pr, main }: Fingerprints) => {
  if (pr === main) return "level"
  if (pr !== base) return "ahead"
  return "behind"
}

/** Lines in the `key=value` format that $GITHUB_OUTPUT expects */
export const formatGithubOutputs = (record: Readonly<Record<string, string>>) => {
  return Object.entries(record)
    .map(([k, v]) => `${k}=${v}\n`)
    .join("")
}
