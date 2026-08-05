import { Octokit } from "@octokit/rest"
import ts from "typescript"
import { expandOptionals, joinPaths, toSampleURL } from "./canonicalize"

export interface ForceRoute {
  /** App folder name, e.g. "Fair" */
  app: string
  /** Source route file, e.g. "src/Apps/Fair/fairRoutes.tsx" */
  file: string
  /** Fully-qualified canonical path template, e.g. "/fair/:slug/artworks" */
  forcePath: string
  /** Concrete sample URL with params substituted, for feeding eigen's matcher */
  sampleURL: string
}

const FORCE_REPO_OWNER = "artsy"
const FORCE_REPO_NAME = "force"
const FORCE_BRANCH = "main"

/** List every *Routes.tsx under src/Apps in force via the git tree API. */
export async function listForceRouteFiles(): Promise<string[]> {
  if (!process.env.GITHUB_TOKEN) {
    console.warn(
      "⚠️  GITHUB_TOKEN not set — GitHub API requests are unauthenticated and rate-limited to\n" +
        "   60/hour, which is not enough to fetch every force route file. Add GITHUB_TOKEN\n" +
        "   (a token with public repo read access) to .env.releases to avoid rate-limit failures."
    )
  }

  const { data } = await githubCall("force git tree", () =>
    gh().git.getTree({
      owner: FORCE_REPO_OWNER,
      repo: FORCE_REPO_NAME,
      tree_sha: FORCE_BRANCH,
      recursive: "1",
    })
  )
  if (data.truncated) {
    console.warn(
      "⚠️  force's git tree came back truncated — some route files may be missing from the report."
    )
  }
  return (
    data.tree
      // `path` is optional in the tree schema; entries without one can't be route
      // files, and "" never matches the regex below.
      .map((entry) => entry.path ?? "")
      .filter((p) => /src\/Apps\/.*[Rr]outes\.tsx$/.test(p))
  )
}

/** Fetch a file's raw text from force. */
export async function fetchForceFile(path: string): Promise<string> {
  const { data } = await githubCall(path, () =>
    gh().repos.getContent({
      owner: FORCE_REPO_OWNER,
      repo: FORCE_REPO_NAME,
      path,
      ref: FORCE_BRANCH,
    })
  )
  // A file (not a directory) response carries base64 `content`.
  const content = (data as { content?: string }).content ?? ""
  return Buffer.from(content, "base64").toString("utf8")
}

export async function parseForceRoutes(
  files: string[],
  fetch: (path: string) => Promise<string> = fetchForceFile
): Promise<{ routes: ForceRoute[]; warnings: string[] }> {
  const routes: ForceRoute[] = []
  const warnings: string[] = []

  for (const file of files) {
    const app = appNameFromPath(file)
    let code: string
    try {
      code = await fetch(file)
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
      if (roots.length === 0) {
        warnings.push(
          `No route arrays found in ${file} — check for an unsupported initializer (as const / satisfies).`
        )
      }
      for (const arr of roots) {
        for (const el of arr.elements) {
          if (ts.isObjectLiteralExpression(el)) {
            walkForceRoute(el, "", { app, file, routes, warnings })
          } else if (ts.isSpreadElement(el)) {
            warnings.push(
              `Spread element in a route array in ${file} — spread routes are parsed unprefixed.`
            )
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
    // Can't resolve the path statically — a non-literal/shorthand `path`, or a
    // spread that might carry one. Recursing would truncate children's prefix.
    const unresolvable =
      hasProp(obj, "path") ||
      obj.properties.some(
        (p) =>
          ts.isSpreadAssignment(p) ||
          (ts.isShorthandPropertyAssignment(p) && p.name.text === "path")
      )
    if (unresolvable) {
      ctx.warnings.push(
        `Unresolvable route object in ${ctx.file} (spread or non-literal/shorthand path) — skipping this route and its children.`
      )
      return
    }
    // No `path` at all — a layout wrapper; recurse into children.
    recurseChildren(obj, prefix, ctx)
    return
  }

  const full = joinPaths(prefix, rawPath)

  // Emit the route (expanding optional params into with/without variants)
  for (const canonical of expandOptionals(full)) {
    ctx.routes.push({
      app: ctx.app,
      file: ctx.file,
      forcePath: canonical,
      sampleURL: toSampleURL(canonical),
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
    } else if (ts.isSpreadElement(child)) {
      ctx.warnings.push(
        `Spread element in \`children\` under "${prefix || "/"}" in ${
          ctx.file
        } — those routes won't inherit the prefix.`
      )
    }
  }
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

function propName(name: ts.PropertyName): string | undefined {
  if (ts.isIdentifier(name) || ts.isStringLiteralLike(name)) return name.text
  return undefined
}

function hasProp(obj: ts.ObjectLiteralExpression, key: string): boolean {
  return obj.properties.some((p) => ts.isPropertyAssignment(p) && propName(p.name) === key)
}

function appNameFromPath(file: string): string {
  const m = file.match(/src\/Apps\/([^/]+)\//)
  return m ? m[1] : "Unknown"
}

let _octokit: Octokit | undefined
function gh(): Octokit {
  if (!_octokit) {
    _octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
  }
  return _octokit
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function isRateLimited(e: any): boolean {
  const remaining =
    e?.response?.headers?.["x-ratelimit-remaining"] ?? e?.headers?.["x-ratelimit-remaining"]
  return remaining === "0" || /rate limit/i.test(String(e?.message ?? ""))
}

/** Run an Octokit request, retrying transient failures with a short backoff. */
async function githubCall<T>(label: string, request: () => Promise<T>): Promise<T> {
  const MAX_ATTEMPTS = 3
  let lastErr: any
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await request()
    } catch (e: any) {
      lastErr = e
      // Client errors (4xx) are deterministic — don't waste retries on them.
      if (typeof e?.status === "number" && e.status >= 400 && e.status < 500) break
      if (attempt < MAX_ATTEMPTS) await sleep(250 * attempt)
    }
  }
  if (isRateLimited(lastErr)) {
    throw new Error(
      `GitHub API rate limit hit for ${label}. ` +
        (process.env.GITHUB_TOKEN
          ? "Wait for the limit to reset."
          : "Add GITHUB_TOKEN to .env.releases — unauthenticated requests are capped at 60/hour.")
    )
  }
  if (lastErr?.status === 401 || lastErr?.status === 403) {
    throw new Error(
      `GitHub API returned ${lastErr.status} (${lastErr.message}) for ${label} — check ` +
        "GITHUB_TOKEN in .env.releases (it may be expired or lack public-repo read access)."
    )
  }
  throw lastErr
}
