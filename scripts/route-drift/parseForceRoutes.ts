import { execFileSync } from "child_process"
import ts from "typescript"

export interface ForceRoute {
  /** App folder name, e.g. "Fair" */
  app: string
  /** Source route file, e.g. "src/Apps/Fair/fairRoutes.tsx" */
  file: string
  /** Fully-qualified canonical path template, e.g. "/fair/:slug/artworks" */
  forcePath: string
  /** Concrete sample URL with params substituted, for feeding eigen's matcher */
  sampleURL: string
  /** Whether the route object declares a component/render (navigable) */
  hasComponent: boolean
}

const FORCE_REPO = "artsy/force"
const FORCE_BRANCH = "main"
const WEB_ORIGIN = "https://www.artsy.net"

/** List every *Routes.tsx under src/Apps in force via the git tree API. */
export function listForceRouteFiles(): string[] {
  const out = ghApi(
    `repos/${FORCE_REPO}/git/trees/${FORCE_BRANCH}?recursive=1`,
    '.tree[].path | select(test("src/Apps/.*[Rr]outes\\\\.tsx$"))'
  )
  return out
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
}

/** Fetch a file's raw text from force. */
export function fetchForceFile(path: string): string {
  const b64 = ghApi(`repos/${FORCE_REPO}/contents/${path}?ref=${FORCE_BRANCH}`, ".content")
  return Buffer.from(b64, "base64").toString("utf8")
}

export function parseForceRoutes(
  files: string[],
  fetch: (path: string) => string = fetchForceFile
): { routes: ForceRoute[]; warnings: string[] } {
  const routes: ForceRoute[] = []
  const warnings: string[] = []

  for (const file of files) {
    const app = appNameFromPath(file)
    let code: string
    try {
      code = fetch(file)
    } catch (e) {
      warnings.push(`Failed to fetch ${file}: ${(e as Error).message}`)
      continue
    }

    try {
      const source = ts.createSourceFile(
        file,
        code,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX
      )
      const roots = findForceRouteArrays(source)
      for (const arr of roots) {
        for (const el of arr.elements) {
          if (ts.isObjectLiteralExpression(el)) {
            walkForceRoute(el, "", { app, file, routes, warnings })
          }
        }
      }
    } catch (e) {
      warnings.push(`Failed to parse ${file}: ${(e as Error).message}`)
    }
  }

  // De-dupe identical canonical paths (children arrays can repeat)
  const seen = new Set<string>()
  const deduped = routes.filter((r) => {
    const key = r.forcePath
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  return { routes: deduped, warnings }
}

interface WalkCtx {
  app: string
  file: string
  routes: ForceRoute[]
  warnings: string[]
}

function walkForceRoute(obj: ts.ObjectLiteralExpression, prefix: string, ctx: WalkCtx) {
  const rawPath = getStringProp(obj, "path")
  if (rawPath === undefined) {
    // Layout wrapper without its own path — still recurse into children
    recurseChildren(obj, prefix, ctx)
    return
  }

  const full = joinPaths(prefix, rawPath)
  const hasComponent = objHasAny(obj, ["getComponent", "Component", "render", "getElement"])

  // Emit the route (expanding optional params into with/without variants)
  for (const canonical of expandOptionals(full)) {
    ctx.routes.push({
      app: ctx.app,
      file: ctx.file,
      forcePath: canonical,
      sampleURL: toSampleURL(canonical),
      hasComponent,
    })
  }

  recurseChildren(obj, full, ctx)
}

function recurseChildren(obj: ts.ObjectLiteralExpression, prefix: string, ctx: WalkCtx) {
  const children = getArrayProp(obj, "children")
  if (!children) return
  for (const child of children.elements) {
    if (ts.isObjectLiteralExpression(child)) {
      walkForceRoute(child, prefix, ctx)
    }
  }
}

// --- path canonicalization ---------------------------------------------------

/** Join a parent prefix with a (possibly relative, possibly index "") child path. */
function joinPaths(prefix: string, path: string): string {
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
function stripRegex(path: string): string {
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
function expandOptionals(path: string): string[] {
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
function toSampleURL(path: string): string {
  const concrete = path
    .replace(/:([\w-]+)\??/g, (_, name) => `example-${name}`) // handles inline params too
    .replace(/\*/g, "example-splat")
  return `${WEB_ORIGIN}${concrete.startsWith("/") ? "" : "/"}${concrete}`
}

// --- AST helpers -------------------------------------------------------------

/** Find array literals assigned to a variable whose name ends in "Routes". */
function findForceRouteArrays(source: ts.SourceFile): ts.ArrayLiteralExpression[] {
  const arrays: ts.ArrayLiteralExpression[] = []
  const visit = (node: ts.Node) => {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      /routes$/i.test(node.name.text) &&
      node.initializer &&
      ts.isArrayLiteralExpression(node.initializer)
    ) {
      arrays.push(node.initializer)
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
  return arrays
}

function getStringProp(obj: ts.ObjectLiteralExpression, key: string): string | undefined {
  for (const prop of obj.properties) {
    if (
      ts.isPropertyAssignment(prop) &&
      propName(prop.name) === key &&
      ts.isStringLiteralLike(prop.initializer)
    ) {
      return prop.initializer.text
    }
  }
  return undefined
}

function getArrayProp(
  obj: ts.ObjectLiteralExpression,
  key: string
): ts.ArrayLiteralExpression | undefined {
  for (const prop of obj.properties) {
    if (
      ts.isPropertyAssignment(prop) &&
      propName(prop.name) === key &&
      ts.isArrayLiteralExpression(prop.initializer)
    ) {
      return prop.initializer
    }
  }
  return undefined
}

function objHasAny(obj: ts.ObjectLiteralExpression, keys: string[]): boolean {
  return obj.properties.some((prop) => {
    const name =
      (ts.isPropertyAssignment(prop) ||
        ts.isMethodDeclaration(prop) ||
        ts.isShorthandPropertyAssignment(prop)) &&
      prop.name
        ? propName(prop.name)
        : undefined
    return name !== undefined && keys.includes(name)
  })
}

function propName(name: ts.PropertyName): string | undefined {
  if (ts.isIdentifier(name) || ts.isStringLiteralLike(name)) return name.text
  return undefined
}

function appNameFromPath(file: string): string {
  const m = file.match(/src\/Apps\/([^/]+)\//)
  return m ? m[1] : "Unknown"
}

function ghApi(endpoint: string, jq: string): string {
  return execFileSync("gh", ["api", endpoint, "--jq", jq], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  }).trimEnd()
}
