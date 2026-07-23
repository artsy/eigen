import { readFileSync } from "fs"
import { join } from "path"
import ts from "typescript"

export interface EigenRoute {
  /** The route path template, e.g. "/fair/:fairID/artworks" */
  path: string
  /** The AppModule name this route resolves to, e.g. "Fair", "ReactWebView" */
  name: string
  /** Source order index within artsyDotNetRoutes (matching is order-sensitive) */
  order: number
}

const EIGEN_ROUTES_FILE = join(__dirname, "../../src/app/Navigation/routes.tsx")

/**
 * Statically extracts the ordered list of artsy.net routes from eigen's
 * routes.tsx. Order is preserved because eigen matches routes first-match-wins
 * (see matchRoute.ts), so the trailing `/:slug` (VanityURLEntity) catch-all
 * must stay last.
 *
 * Handles both entry forms found in `defineRoutes([...])`:
 *   1. Object literals:            { path: "/x", name: "Foo", ... }
 *   2. webViewRoute({ path: ... }) → name "ReactWebView" | "ModalWebView"
 */
export function parseEigenRoutes(file = EIGEN_ROUTES_FILE): {
  routes: EigenRoute[]
  warnings: string[]
} {
  const code = readFileSync(file, "utf8")
  const source = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)

  const routes: EigenRoute[] = []
  const warnings: string[] = []

  // Find `export const artsyDotNetRoutes = defineRoutes([ ... ])`
  const arrayNode = findRouteArray(source, "artsyDotNetRoutes")
  if (!arrayNode) {
    throw new Error("Could not locate artsyDotNetRoutes array in routes.tsx")
  }

  arrayNode.elements.forEach((el, i) => {
    const parsed = parseRouteElement(el)
    if (parsed) {
      routes.push({ ...parsed, order: i })
    } else {
      warnings.push(
        `Unparsed eigen route element #${i}: ${el
          .getText(source)
          .slice(0, 80)
          .replace(/\s+/g, " ")}`
      )
    }
  })

  return { routes, warnings }
}

function findRouteArray(
  source: ts.SourceFile,
  varName: string
): ts.ArrayLiteralExpression | undefined {
  let result: ts.ArrayLiteralExpression | undefined

  const visit = (node: ts.Node) => {
    if (result) return
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === varName &&
      node.initializer
    ) {
      // initializer is `defineRoutes([...])` (or a bare array)
      const init = node.initializer
      if (ts.isCallExpression(init) && init.arguments.length > 0) {
        const arg = init.arguments[0]
        if (ts.isArrayLiteralExpression(arg)) {
          result = arg
          return
        }
      }
      if (ts.isArrayLiteralExpression(init)) {
        result = init
        return
      }
    }
    ts.forEachChild(node, visit)
  }

  visit(source)
  return result
}

function parseRouteElement(el: ts.Expression): { path: string; name: string } | undefined {
  // Form 1: object literal { path, name }
  if (ts.isObjectLiteralExpression(el)) {
    const path = getStringProp(el, "path")
    const name = getStringProp(el, "name")
    if (path && name) return { path, name }
    return undefined
  }

  // Form 2: webViewRoute({ path, ... }) / addWebViewRoute(...)
  if (ts.isCallExpression(el) && ts.isIdentifier(el.expression)) {
    const callee = el.expression.text
    if (callee === "webViewRoute" || callee === "addWebViewRoute") {
      const arg = el.arguments[0]
      if (arg && ts.isObjectLiteralExpression(arg)) {
        const path = getStringProp(arg, "path")
        const modal = getBoolProp(arg, "alwaysPresentModally")
        if (path) {
          return { path, name: modal ? "ModalWebView" : "ReactWebView" }
        }
      }
    }
  }

  return undefined
}

function getStringProp(obj: ts.ObjectLiteralExpression, key: string): string | undefined {
  for (const prop of obj.properties) {
    if (
      ts.isPropertyAssignment(prop) &&
      getPropName(prop) === key &&
      ts.isStringLiteralLike(prop.initializer)
    ) {
      return prop.initializer.text
    }
  }
  return undefined
}

function getBoolProp(obj: ts.ObjectLiteralExpression, key: string): boolean {
  for (const prop of obj.properties) {
    if (ts.isPropertyAssignment(prop) && getPropName(prop) === key) {
      return prop.initializer.kind === ts.SyntaxKind.TrueKeyword
    }
  }
  return false
}

function getPropName(prop: ts.PropertyAssignment): string | undefined {
  const n = prop.name
  if (ts.isIdentifier(n) || ts.isStringLiteralLike(n)) return n.text
  return undefined
}
