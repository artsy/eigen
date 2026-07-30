// Test harness for parseForceRoutes, run in a child tsx process by
// __tests__/parseForceRoutes.tests.ts.
//
// Why a subprocess: parseForceRoutes imports `typescript`, and importing that
// under our Jest config (the `react-native` preset + jsdom) is pathologically
// slow — a single `import ts from "typescript"` test measured ~40 minutes,
// where tsx (plain Node) loads it in ~1s. So the walker is exercised here under
// tsx and asserted on from Jest via stdout, rather than imported into Jest.
//
// Alternative if we ever want these in-process: give `scripts/**` its own Jest
// `project` with `testEnvironment: "node"` and no RN preset/setup — that removes
// the slowdown (and would let matchIsolation.tests.ts drop its subprocess too).
// Deferred to keep this PR from touching the shared jest.config.js.
//
// Reads a JSON array of { name, src, throws? } fixtures from stdin, runs each
// through parseForceRoutes with an injected fetch, and writes the results
// (forcePaths, sampleURLs, warnings) as JSON to stdout.
import { readFileSync } from "fs"
import { parseForceRoutes } from "./parseForceRoutes"

interface Fixture {
  name: string
  src?: string
  throws?: boolean
}

async function main() {
  const fixtures: Fixture[] = JSON.parse(readFileSync(0, "utf8"))
  const results = []
  for (const f of fixtures) {
    const fetch = f.throws
      ? async () => {
          throw new Error("simulated fetch failure")
        }
      : async () => f.src ?? ""
    const { routes, warnings } = await parseForceRoutes(["src/Apps/Test/testRoutes.tsx"], fetch)
    results.push({
      name: f.name,
      forcePaths: routes.map((r) => r.forcePath),
      sampleURLs: routes.map((r) => r.sampleURL),
      warnings,
    })
  }
  process.stdout.write(JSON.stringify(results))
}

main()
