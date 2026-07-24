/**
 * Route drift report: compares eigen's Navigation/routes.tsx against
 * artsy/force's per-app *Routes.tsx to surface universal-link / deep-link drift.
 *
 * Answers:
 *   - Which force routes does eigen handle natively, and where do they route?
 *   - Which force routes does eigen NOT handle (fall through to a webview)?
 *   - Which native eigen routes have no force counterpart (candidate orphans)?
 *
 * Usage:  yarn route-drift            # writes report, exits 0
 *         yarn route-drift --strict   # exits 1 if non-allowlisted drift exists (for CI)
 *
 * Force routes are fetched live via `gh api` (requires `gh auth`). Deliberate
 * universal-link exclusions are read live from artsy.net's AASA file.
 */
import { readFileSync, writeFileSync } from "fs"
import { join } from "path"
import { parse } from "url"
import { classifyURL, compileEigenRoutes } from "./match"
import { AASAExclusions, fetchAASAExclusions } from "./parseAASA"
import { AndroidAllowlist, parseAndroidManifest } from "./parseAndroidManifest"
import { EigenRoute, parseEigenRoutes } from "./parseEigenRoutes"
import {
  ForceRoute,
  fetchForceFile,
  listForceRouteFiles,
  parseForceRoutes,
} from "./parseForceRoutes"

const REPORT_PATH = join(__dirname, "route-drift-report.md")
const ALLOWLIST_PATH = join(__dirname, "allowlist.json")

interface Allowlist {
  ignorePrefixes: { prefix: string; reason: string }[]
  expectedWebview: { forcePath: string; reason: string }[]
  expectedOrphans: { eigenPath: string; reason: string }[]
}

interface ForceRow extends ForceRoute {
  module: string
  matchedPath: string | null
  isNative: boolean
  allowlisted: boolean
  aasaExcluded: boolean
  /** Matched an ignore-prefix (dev tooling) — hidden from the report entirely. */
  ignored: boolean
}

const NON_NATIVE = new Set(["ReactWebView", "ModalWebView", "VanityURLEntity"])

function main() {
  const strict = process.argv.includes("--strict")
  const allowlist = loadAllowlist()
  const allowedWebview = new Set(allowlist.expectedWebview.map((e) => e.forcePath))
  const allowedOrphans = new Set(allowlist.expectedOrphans.map((e) => e.eigenPath))
  const ignorePrefixes = allowlist.ignorePrefixes.map((e) => e.prefix)

  const matchesIgnorePrefix = (path: string): boolean =>
    ignorePrefixes.some((p) => path === p || path.startsWith(p))

  const isSuppressed = (forcePath: string): boolean =>
    allowedWebview.has(forcePath) || matchesIgnorePrefix(forcePath)

  // 1. eigen
  const { routes: eigenRoutes, warnings: eigenWarn } = parseEigenRoutes()
  const compiled = compileEigenRoutes(eigenRoutes)

  // 2. force
  console.log("Fetching force route files via gh api…")
  const files = listForceRouteFiles()
  console.log(`  found ${files.length} *Routes.tsx files`)
  const { routes: forceRoutes, warnings: forceWarn } = parseForceRoutes(files, fetchForceFile)
  console.log(`  extracted ${forceRoutes.length} canonical force route templates`)

  // 3. AASA — deliberate universal-link exclusions (best-effort; network)
  const aasaWarn: string[] = []
  let aasa: AASAExclusions = { patterns: [], matches: () => false }
  try {
    aasa = fetchAASAExclusions()
    console.log(`  loaded ${aasa.patterns.length} AASA universal-link exclusions`)
  } catch (e) {
    aasaWarn.push(`Could not fetch AASA exclusions (skipping this layer): ${(e as Error).message}`)
  }

  // 3b. Android App Links allowlist (local AndroidManifest.xml)
  const manifestWarn: string[] = []
  let android: AndroidAllowlist = { rules: [], prefixes: [], match: () => null }
  try {
    android = parseAndroidManifest()
    console.log(`  loaded ${android.prefixes.length} Android manifest path rules`)
  } catch (e) {
    manifestWarn.push(
      `Could not parse AndroidManifest.xml (skipping Android checks): ${(e as Error).message}`
    )
  }

  // Check A — cross-platform inconsistency: paths the Android manifest INCLUDES
  // that iOS AASA deliberately EXCLUDES (e.g. /news). Android prefix matching is
  // not segment-aware, so overlap = either string is a prefix of the other.
  const conflictMap = new Map<string, Set<string>>()
  for (const pattern of aasa.patterns) {
    const base = pattern.replace(/\/\*$/, "").replace(/\*$/, "")
    for (const prefix of android.prefixes) {
      if (base === prefix || base.startsWith(prefix) || prefix.startsWith(base)) {
        const patterns = conflictMap.get(prefix) ?? new Set<string>()
        patterns.add(pattern)
        conflictMap.set(prefix, patterns)
      }
    }
  }
  const androidConflicts = [...conflictMap.entries()]
    .map(([manifestPath, patterns]) => ({ manifestPath, aasaPatterns: [...patterns].sort() }))
    .sort((a, b) => a.manifestPath.localeCompare(b.manifestPath))

  // Check B — eigen native screens NOT reachable via an Android App Link (no
  // matching manifest rule). Parallel to the iOS 🔀 check.
  const nativeNotInManifest = eigenRoutes
    .filter((r) => !NON_NATIVE.has(r.name))
    .filter((r) => r.path !== "/" && !r.path.includes("*"))
    // Leading-param routes (e.g. "/:profile_id_ignored/artist/:artistID", a legacy
    // alias) have no static prefix, so Android can't allowlist them — not actionable.
    .filter((r) => !r.path.startsWith("/:"))
    .filter((r) => !matchesIgnorePrefix(r.path))
    .filter((r) => !android.match(concretePath(r.path)))

  // 4. forward: classify every force route through eigen's matcher
  const forceRows: ForceRow[] = forceRoutes.map((r) => {
    const res = classifyURL(r.sampleURL, compiled)
    const pathname = parse(r.sampleURL).pathname ?? "/"
    return {
      ...r,
      module: res.module,
      matchedPath: res.matchedPath,
      isNative: res.isNative,
      allowlisted: isSuppressed(r.forcePath),
      aasaExcluded: aasa.matches(pathname),
      ignored: matchesIgnorePrefix(r.forcePath),
    }
  })

  // 5. reverse: eigen native routes with no force counterpart
  const forceNormalized = new Set(forceRoutes.map((r) => normalize(r.forcePath)))
  const orphans = eigenRoutes
    .filter((r) => !NON_NATIVE.has(r.name))
    .filter((r) => !r.path.includes("*")) // wildcards can't be point-compared
    .filter((r) => !forceNormalized.has(normalize(r.path)))
    .filter((r) => !allowedOrphans.has(r.path))
    .filter((r) => !matchesIgnorePrefix(r.path))

  // 6. report — a route is "actionable drift" only if it's non-native AND not
  // deliberately suppressed (manual allowlist/prefix) AND not AASA-excluded.
  const drift = forceRows.filter((r) => !r.isNative && !r.allowlisted && !r.aasaExcluded)
  const reportMarkdown = buildReportMarkdown({
    forceRows,
    drift,
    orphans,
    aasaPatterns: aasa.patterns,
    androidConflicts,
    nativeNotInManifest,
    eigenCount: eigenRoutes.length,
    warnings: [...eigenWarn, ...compiled.warnings, ...forceWarn, ...aasaWarn, ...manifestWarn],
  })
  writeFileSync(REPORT_PATH, reportMarkdown)

  const nativeCount = forceRows.filter((r) => r.isNative).length
  const aasaCount = forceRows.filter((r) => !r.isNative && r.aasaExcluded).length
  console.log("")
  console.log(`Report written to ${REPORT_PATH}`)
  console.log(
    `Force routes: ${forceRows.length} total — ${nativeCount} native, ${
      forceRows.length - nativeCount
    } webview (${aasaCount} AASA-excluded, ${drift.length} actionable)`
  )
  console.log(`Eigen orphan routes (no force match): ${orphans.length}`)
  console.log(
    `Android: ${androidConflicts.length} manifest↔AASA conflicts, ${nativeNotInManifest.length} native routes missing from manifest`
  )

  if (strict && (drift.length > 0 || orphans.length > 0)) {
    console.error(
      `\n✗ strict mode: ${drift.length} drift + ${orphans.length} orphan routes not allowlisted`
    )
    process.exit(1)
  }
}

/** Replace `:param` segments with a placeholder so a route path can be matched. */
function concretePath(path: string): string {
  return path.replace(/:([\w-]+)/g, "x")
}

/** Positional param normalization: :slug / :fairID / :id all collapse to `*`. */
function normalize(path: string): string {
  return (
    "/" +
    path
      .split("/")
      .filter(Boolean)
      .map((seg) => (seg.startsWith(":") ? "*" : seg))
      .join("/")
  )
}

function loadAllowlist(): Allowlist {
  try {
    const raw = JSON.parse(readFileSync(ALLOWLIST_PATH, "utf8"))
    return {
      ignorePrefixes: raw.ignorePrefixes ?? [],
      expectedWebview: raw.expectedWebview ?? [],
      expectedOrphans: raw.expectedOrphans ?? [],
    }
  } catch {
    return { ignorePrefixes: [], expectedWebview: [], expectedOrphans: [] }
  }
}

function buildReportMarkdown(data: {
  forceRows: ForceRow[]
  drift: ForceRow[]
  orphans: EigenRoute[]
  aasaPatterns: string[]
  androidConflicts: { manifestPath: string; aasaPatterns: string[] }[]
  nativeNotInManifest: EigenRoute[]
  eigenCount: number
  warnings: string[]
}): string {
  const {
    forceRows,
    drift,
    orphans,
    aasaPatterns,
    androidConflicts,
    nativeNotInManifest,
    eigenCount,
    warnings,
  } = data
  const native = forceRows.filter((r) => r.isNative)
  const suppressed = forceRows.filter((r) => !r.isNative && r.allowlisted)
  const aasaExcluded = forceRows.filter((r) => !r.isNative && !r.allowlisted && r.aasaExcluded)
  // Contradiction: eigen has a native screen, but the AASA file excludes the URL
  // from universal links — so web links never reach the native screen.
  const excludedButNative = forceRows.filter((r) => r.isNative && r.aasaExcluded)
  // Full coverage table omits ignore-prefixed dev tooling (admin/debug/dev/example).
  const byApp = groupBy(
    forceRows.filter((r) => !r.ignored),
    (r) => r.app
  )
  const ignoredCount = forceRows.filter((r) => r.ignored).length

  const lines: string[] = []
  lines.push("# Route Drift Report — eigen ↔ artsy/force")
  lines.push("")
  lines.push(
    "> Generated by `yarn route-drift`. Compares deep-link / universal-link coverage: which artsy.net (force) routes eigen handles natively vs. drops to a webview."
  )
  lines.push("")
  lines.push("## Summary")
  lines.push("")
  lines.push(`- Force route templates analyzed: **${forceRows.length}**`)
  lines.push(`- Handled natively by eigen: **${native.length}**`)
  lines.push(
    `- Fall through to a webview / vanity resolver: **${forceRows.length - native.length}**`
  )
  lines.push(`  - Suppressed via allowlist / ignore-prefixes: **${suppressed.length}**`)
  lines.push(`  - Excluded from universal links by AASA (deliberate): **${aasaExcluded.length}**`)
  lines.push(`  - **Actionable drift: ${drift.length}**`)
  lines.push(
    `- Eigen native routes with no force counterpart (candidate orphans): **${orphans.length}**`
  )
  lines.push(
    `- AASA-excluded but eigen has a native screen (review — universal links bypass the app): **${excludedButNative.length}**`
  )
  lines.push(
    `- Android manifest allowlists a path that iOS AASA excludes (cross-platform inconsistency): **${androidConflicts.length}**`
  )
  lines.push(
    `- Eigen native routes missing from the Android manifest allowlist: **${nativeNotInManifest.length}**`
  )
  lines.push(`- Eigen routes in table: ${eigenCount}`)
  lines.push("")

  // Actionable drift first
  lines.push("## ⚠️ Force routes NOT handled natively (open a webview)")
  lines.push("")
  if (drift.length === 0) {
    lines.push("_None 🎉 (excluding allowlisted entries)._")
  } else {
    lines.push(
      "These artsy.net URLs will open inside a webview in the app. If a native screen exists, this is likely a missing/incorrect eigen route."
    )
    lines.push("")
    lines.push("| App | Force path | Sample URL | Falls back to |")
    lines.push("| --- | --- | --- | --- |")
    for (const r of sortRows(drift)) {
      lines.push(`| ${r.app} | \`${r.forcePath}\` | ${r.sampleURL} | ${r.module} |`)
    }
  }
  lines.push("")

  // Orphans
  lines.push("## ❓ Eigen native routes with no force counterpart")
  lines.push("")
  if (orphans.length === 0) {
    lines.push("_None._")
  } else {
    lines.push(
      "Native routes in eigen that don't map to a known force path. Either app-only screens (fine — allowlist them) or stale routes."
    )
    lines.push("")
    lines.push("| Eigen path | Module |")
    lines.push("| --- | --- |")
    for (const o of orphans.sort((a, b) => a.path.localeCompare(b.path))) {
      lines.push(`| \`${o.path}\` | ${o.name} |`)
    }
  }
  lines.push("")

  // Review: AASA excludes it, but eigen has a native screen
  lines.push("## 🔀 Review: AASA-excluded but eigen has a native screen")
  lines.push("")
  if (excludedButNative.length === 0) {
    lines.push("_None._")
  } else {
    lines.push(
      "eigen has a native screen for these, but the AASA file excludes the URL from universal links — so tapping a web link opens the browser, never the native screen. Often a stale AASA exclusion from before the screen existed. Either remove it from the AASA `NOT` list (in [artsy/artsy-eigen-web-association](https://github.com/artsy/artsy-eigen-web-association)'s `constants.ts`) or confirm the exclusion is intentional. See the AASA rubric in the README."
    )
    lines.push("")
    lines.push("| App | Force path | Native module |")
    lines.push("| --- | --- | --- |")
    for (const r of sortRows(excludedButNative)) {
      lines.push(`| ${r.app} | \`${r.forcePath}\` | ${r.module} |`)
    }
  }
  lines.push("")

  // Android: manifest allowlists a path iOS AASA excludes
  lines.push("## 🤖 Android manifest allowlists a path that iOS excludes")
  lines.push("")
  if (androidConflicts.length === 0) {
    lines.push("_None._")
  } else {
    lines.push(
      "These paths are in the Android App Links allowlist (`android/app/src/main/AndroidManifest.xml`) but iOS AASA deliberately excludes them — so the same link deep-links into the app on Android yet opens the browser on iOS. Reconcile: either add the path to the iOS AASA `NOT` list too, or remove it from both. (`/news` is the canonical example.)"
    )
    lines.push("")
    lines.push("| Android manifest pathPrefix | Conflicting iOS AASA exclusion(s) |")
    lines.push("| --- | --- |")
    for (const c of androidConflicts) {
      lines.push(`| \`${c.manifestPath}\` | ${c.aasaPatterns.map((p) => `\`${p}\``).join(", ")} |`)
    }
  }
  lines.push("")

  // Android: native eigen routes missing from the manifest allowlist
  lines.push("## 🤖 Eigen native routes missing from the Android manifest allowlist")
  lines.push("")
  if (nativeNotInManifest.length === 0) {
    lines.push("_None._")
  } else {
    lines.push(
      "eigen has a native screen for these, but no matching `<data>` rule exists in the Android App Links intent-filter — so tapping the web link on Android opens the browser instead of the app. Add a `pathPrefix` in `android/app/src/main/AndroidManifest.xml` (or confirm the route isn't meant to be deep-linked)."
    )
    lines.push("")
    lines.push("| Eigen path | Module |")
    lines.push("| --- | --- |")
    for (const r of [...nativeNotInManifest].sort((a, b) => a.path.localeCompare(b.path))) {
      lines.push(`| \`${r.path}\` | ${r.name} |`)
    }
  }
  lines.push("")

  // Full coverage table
  lines.push("## Full coverage by app")
  lines.push("")
  lines.push(
    `_Omits ${ignoredCount} ignore-prefixed dev-tooling routes (admin/debug/dev/example)._`
  )
  lines.push("")
  for (const app of Object.keys(byApp).sort()) {
    const rows = sortRows(byApp[app])
    const nativeN = rows.filter((r) => r.isNative).length
    lines.push(`### ${app} (${nativeN}/${rows.length} native)`)
    lines.push("")
    lines.push("| Force path | Sample URL | Eigen result | Status |")
    lines.push("| --- | --- | --- | --- |")
    for (const r of rows) {
      const status = r.isNative
        ? r.aasaExcluded
          ? "🔀 native (⚠️ AASA-excluded)"
          : "✅ native"
        : r.allowlisted
          ? "🟡 webview (allowlisted)"
          : r.aasaExcluded
            ? "🍎 webview (AASA-excluded)"
            : "⚠️ webview"
      const result = r.isNative ? `${r.module} (\`${r.matchedPath}\`)` : r.module
      lines.push(`| \`${r.forcePath}\` | ${r.sampleURL} | ${result} | ${status} |`)
    }
    lines.push("")
  }

  // AASA exclusions reference
  if (aasaPatterns.length) {
    lines.push("## 🍎 AASA universal-link exclusions (live)")
    lines.push("")
    lines.push(
      "Deliberate `NOT` exclusions read from artsy.net's `apple-app-site-association`. URLs matching these never open the app via a universal link, so they're treated as intentional and excluded from actionable drift."
    )
    lines.push("")
    for (const p of aasaPatterns) lines.push(`- \`${p}\``)
    lines.push("")
  }

  if (warnings.length) {
    lines.push("## Parser warnings")
    lines.push("")
    lines.push(
      "Entries the static parsers couldn't fully resolve (may cause false positives/negatives):"
    )
    lines.push("")
    for (const w of warnings) lines.push(`- ${w}`)
    lines.push("")
  }

  return lines.join("\n")
}

function sortRows(rows: ForceRow[]): ForceRow[] {
  return [...rows].sort((a, b) => a.forcePath.localeCompare(b.forcePath))
}

function groupBy<T>(items: T[], key: (t: T) => string): Record<string, T[]> {
  const out: Record<string, T[]> = {}
  for (const it of items) {
    const k = key(it)
    ;(out[k] ??= []).push(it)
  }
  return out
}

main()
