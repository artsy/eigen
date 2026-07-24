import { readFileSync } from "fs"
import { join } from "path"

/**
 * Android App Links path filtering lives in AndroidManifest.xml as an allowlist
 * of `<data>` path rules inside the artsy.net autoVerify intent-filter — there
 * is no deny mechanism on Android (unlike iOS AASA). This parses that allowlist
 * so the drift report can check it against eigen's native routes and the AASA
 * exclusions.
 */
const MANIFEST_FILE = join(__dirname, "../../android/app/src/main/AndroidManifest.xml")
const ARTSY_HOSTS = ["www.artsy.net", "artsy.net", "staging.artsy.net"]

type PathKind = "path" | "pathPrefix" | "pathSuffix" | "pathPattern" | "pathAdvancedPattern"

export interface ManifestPathRule {
  kind: PathKind
  value: string
}

export interface AndroidAllowlist {
  rules: ManifestPathRule[]
  /** Just the pathPrefix values (the only kind Artsy currently uses). */
  prefixes: string[]
  /** The manifest rule that would match a concrete pathname, or null. */
  match: (pathname: string) => ManifestPathRule | null
}

export function parseAndroidManifest(file = MANIFEST_FILE): AndroidAllowlist {
  const xml = readFileSync(file, "utf8")

  // Grab the App Links intent-filter(s) — those declaring an artsy.net host.
  const rules: ManifestPathRule[] = []
  const filters = xml.match(/<intent-filter[\s\S]*?<\/intent-filter>/g) ?? []
  for (const filter of filters) {
    const hosts = [...filter.matchAll(/android:host="([^"]+)"/g)].map((m) => m[1])
    if (!hosts.some((h) => ARTSY_HOSTS.includes(h))) continue

    const re = /android:(path|pathPrefix|pathSuffix|pathPattern|pathAdvancedPattern)="([^"]+)"/g
    for (const m of filter.matchAll(re)) {
      rules.push({ kind: m[1] as PathKind, value: m[2] })
    }
  }

  const prefixes = rules.filter((r) => r.kind === "pathPrefix").map((r) => r.value)

  const match = (pathname: string): ManifestPathRule | null => {
    for (const rule of rules) {
      if (matchesRule(pathname, rule)) return rule
    }
    return null
  }

  return { rules, prefixes, match }
}

function matchesRule(pathname: string, rule: ManifestPathRule): boolean {
  switch (rule.kind) {
    case "path":
      return pathname === rule.value
    case "pathPrefix":
      return pathname.startsWith(rule.value)
    case "pathSuffix":
      return pathname.endsWith(rule.value)
    case "pathPattern":
    case "pathAdvancedPattern":
      try {
        return androidPatternToRegExp(rule.value).test(pathname)
      } catch {
        return false
      }
  }
}

/**
 * Best-effort conversion of Android's path pattern glob to a RegExp. Android's
 * `pathPattern` uses `.` (any char) and `*` (zero-or-more of the preceding
 * char); `.*` is any sequence. Artsy uses only `pathPrefix` today, so this is a
 * safety net rather than a hot path.
 */
function androidPatternToRegExp(pattern: string): RegExp {
  let out = ""
  for (let i = 0; i < pattern.length; i++) {
    const c = pattern[i]
    if (c === ".") out += "."
    else if (c === "*") out += "*"
    else out += c.replace(/[\\^$+?()[\]{}|]/g, "\\$&")
  }
  return new RegExp(`^${out}$`)
}
