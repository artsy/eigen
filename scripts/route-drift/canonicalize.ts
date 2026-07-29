// Pure path-canonicalization helpers shared by the force route parser. Kept in
// their own module (no typescript / octokit imports) so they can be unit-tested
// without dragging the whole fetch + AST toolchain into the test.

const WEB_ORIGIN = "https://www.artsy.net"

/** Join a parent prefix with a (possibly relative, possibly index "") child path. */
export function joinPaths(prefix: string, path: string): string {
  const clean = stripRegex(path)
  if (clean === "" || clean === "/") return prefix || "/"
  const a = prefix.replace(/\/+$/, "")
  const b = clean.replace(/^\/+/, "")
  const joined = `${a}/${b}`.replace(/\/{2,}/g, "/")
  return joined.startsWith("/") ? joined : `/${joined}`
}

/**
 * Force uses react-router path syntax with regex escape hatches, e.g.
 * "exhibitors(.*)?", "booths(.*)?". Strip regex groups down to the literal.
 */
export function stripRegex(path: string): string {
  return path
    .replace(/\([^)]*\)\??/g, "") // drop (.*) / (foo|bar)? groups
    .replace(/\/{2,}/g, "/")
}

/**
 * Expand optional params `:x?` into templates.
 * A missing optional only yields a real URL when it's the LAST segment
 * ("/collect/:medium?" -> "/collect/:medium" + "/collect"). Dropping a
 * non-terminal optional produces a nonsense path ("/fair/:slug?/exhibitors"
 * -> "/fair/exhibitors"), so there we keep only the present variant.
 */
export function expandOptionals(path: string): string[] {
  const segments = path.split("/")
  const idx = segments.findIndex((s) => /^:[\w-]+\?$/.test(s))
  if (idx === -1) return [path.replace(/\?/g, "")]

  const isLast = idx === segments.length - 1
  const present = [...segments]
  present[idx] = segments[idx].replace(/\?$/, "")
  const results = expandOptionals(present.join("/"))

  if (isLast) {
    const absent = segments.filter((_, i) => i !== idx)
    results.push(...expandOptionals(absent.join("/") || "/"))
  }
  return results
}

/** Turn a canonical path template into a concrete sample URL for eigen's matcher. */
export function toSampleURL(path: string): string {
  const concrete = path
    .replace(/:([\w-]+)\??/g, (_, name) => `example-${name}`) // handles inline params too
    .replace(/\*/g, "example-splat")
  return `${WEB_ORIGIN}${concrete.startsWith("/") ? "" : "/"}${concrete}`
}
