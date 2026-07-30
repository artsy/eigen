// Test harness for parseEigenRoutes, run in a child tsx process by
// __tests__/parseEigenRoutes.tests.ts — same reasoning as
// parseForceRoutesHarness.ts (parseEigenRoutes imports `typescript`, which is
// ~40 min to import under our Jest config but ~1s under tsx).
//
// parseEigenRoutes reads a file path (no injectable content), so each fixture's
// source is written to a temp file. Reads a JSON array of { name, src } from
// stdin and writes { name, routes, warnings } | { name, error } to stdout.
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "fs"
import { tmpdir } from "os"
import { join } from "path"
import { parseEigenRoutes } from "./parseEigenRoutes"

interface Fixture {
  name: string
  src: string
}

function main() {
  const fixtures: Fixture[] = JSON.parse(readFileSync(0, "utf8"))
  const dir = mkdtempSync(join(tmpdir(), "eigen-route-drift-"))
  const results = []
  for (const [i, f] of fixtures.entries()) {
    const file = join(dir, `fixture-${i}.tsx`)
    writeFileSync(file, f.src)
    try {
      const { routes, warnings } = parseEigenRoutes(file)
      results.push({ name: f.name, routes, warnings })
    } catch (e) {
      results.push({ name: f.name, error: (e as Error).message })
    }
  }
  rmSync(dir, { recursive: true, force: true })
  process.stdout.write(JSON.stringify(results))
}

main()
