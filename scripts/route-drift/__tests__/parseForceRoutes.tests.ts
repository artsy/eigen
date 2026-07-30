import { execFileSync } from "child_process"
import { join } from "path"

// parseForceRoutes imports `typescript`, which is ~40 min to import under our
// Jest config but ~1s under tsx — so we run the walker over inline *Routes.tsx
// fixtures in a child tsx process and assert on the JSON it returns. See
// parseForceRoutesHarness.ts for the full reasoning and the in-process
// alternative (a node-env Jest project for scripts/**).
const TSX = join(__dirname, "../../../node_modules/.bin/tsx")
const HARNESS = join(__dirname, "../parseForceRoutesHarness.ts")

interface FixtureResult {
  name: string
  forcePaths: string[]
  sampleURLs: string[]
  warnings: string[]
}

const FIXTURES = [
  {
    name: "nested",
    src: `const aRoutes = [{ path: "/fair/:slug", children: [{ path: "artworks" }] }]`,
  },
  { name: "layoutWrapper", src: `const aRoutes = [{ children: [{ path: "/x" }] }]` },
  { name: "optional", src: `const aRoutes = [{ path: "/collect/:medium?" }]` },
  {
    name: "regexStrip",
    src: `const aRoutes = [{ path: "/fair/:slug", children: [{ path: "exhibitors(.*)?" }] }]`,
  },
  {
    name: "nonLiteralPath",
    src: `const aRoutes = [{ path: PATH_VAR, children: [{ path: "child" }] }]`,
  },
  {
    name: "spreadChildren",
    src: `const aRoutes = [{ path: "/fair/:slug", children: [{ path: "a" }, ...more] }]`,
  },
  { name: "spreadTop", src: `const aRoutes = [{ path: "/a" }, ...more]` },
  { name: "dedup", src: `const aRoutes = [{ path: "/x" }, { path: "/x" }]` },
  { name: "noArrays", src: `const notAnArray = 5` },
  { name: "fetchFail", throws: true },
]

describe("parseForceRoutes (fixtures via tsx)", () => {
  let byName: Record<string, FixtureResult>

  beforeAll(() => {
    const out = execFileSync(TSX, [HARNESS], {
      input: JSON.stringify(FIXTURES),
      encoding: "utf8",
      timeout: 60_000,
    })
    const results: FixtureResult[] = JSON.parse(out)
    byName = Object.fromEntries(results.map((r) => [r.name, r]))
  })

  it("joins nested child paths onto the parent prefix", () => {
    expect(byName.nested.forcePaths).toEqual(["/fair/:slug", "/fair/:slug/artworks"])
  })

  it("recurses a pathless layout wrapper into its children", () => {
    expect(byName.layoutWrapper.forcePaths).toEqual(["/x"])
  })

  it("expands a trailing optional param into with/without variants", () => {
    expect(byName.optional.forcePaths).toEqual(["/collect/:medium", "/collect"])
  })

  it("strips react-router regex escape-hatches from a segment", () => {
    expect(byName.regexStrip.forcePaths).toEqual(["/fair/:slug", "/fair/:slug/exhibitors"])
  })

  it("substitutes params into the sample URL", () => {
    expect(byName.nested.sampleURLs).toContain("https://www.artsy.net/fair/example-slug")
  })

  it("skips a non-literal path (and its children) with a warning", () => {
    expect(byName.nonLiteralPath.forcePaths).toEqual([])
    expect(byName.nonLiteralPath.warnings).toEqual([expect.stringContaining("Non-literal `path`")])
  })

  it("warns on a spread element inside children", () => {
    expect(byName.spreadChildren.forcePaths).toEqual(["/fair/:slug", "/fair/:slug/a"])
    expect(byName.spreadChildren.warnings).toEqual([
      expect.stringContaining("Spread element in `children`"),
    ])
  })

  it("warns on a spread element in a top-level route array", () => {
    expect(byName.spreadTop.forcePaths).toEqual(["/a"])
    expect(byName.spreadTop.warnings).toEqual([
      expect.stringContaining("Spread element in a route array"),
    ])
  })

  it("de-dupes identical canonical paths", () => {
    expect(byName.dedup.forcePaths).toEqual(["/x"])
  })

  it("warns when a file yields no route arrays", () => {
    expect(byName.noArrays.forcePaths).toEqual([])
    expect(byName.noArrays.warnings).toEqual([expect.stringContaining("No route arrays found")])
  })

  it("warns (and drops the file) when the fetch fails", () => {
    expect(byName.fetchFail.forcePaths).toEqual([])
    expect(byName.fetchFail.warnings).toEqual([expect.stringContaining("Failed to fetch")])
  })
})
