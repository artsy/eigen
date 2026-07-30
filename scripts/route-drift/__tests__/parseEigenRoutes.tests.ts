import { execFileSync } from "child_process"
import { join } from "path"

// parseEigenRoutes imports `typescript` (~40 min under our Jest config, ~1s
// under tsx), so we run it over inline routes.tsx fixtures in a child tsx
// process. See parseEigenRoutesHarness.ts for the reasoning.
const TSX = join(__dirname, "../../../node_modules/.bin/tsx")
const HARNESS = join(__dirname, "../parseEigenRoutesHarness.ts")

interface EigenRoute {
  path: string
  name: string
  order: number
}
interface FixtureResult {
  name: string
  routes?: EigenRoute[]
  warnings?: string[]
  error?: string
}

const FIXTURES = [
  {
    name: "orderAndFields",
    src: `export const artsyDotNetRoutes = [
      { path: "/artwork/:artworkID", name: "Artwork" },
      { path: "/artist/:artistID", name: "Artist" },
    ]`,
  },
  { name: "webView", src: `const artsyDotNetRoutes = [webViewRoute({ path: "/terms" })]` },
  {
    name: "modalWebView",
    src: `const artsyDotNetRoutes = [webViewRoute({ path: "/conditions-of-sale", config: { alwaysPresentModally: true } })]`,
  },
  {
    name: "leadingParamAlias",
    src: `const artsyDotNetRoutes = [{ path: "/:profile_id_ignored/artist/:artistID", name: "Artist" }]`,
  },
  {
    name: "defineRoutesWrapper",
    src: `export const artsyDotNetRoutes = defineRoutes([{ path: "/x", name: "X" }])`,
  },
  { name: "missingName", src: `const artsyDotNetRoutes = [{ path: "/x" }]` },
  { name: "missingArray", src: `const notTheRoutes = [{ path: "/x", name: "X" }]` },
]

describe("parseEigenRoutes (fixtures via tsx)", () => {
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

  it("extracts path + name and preserves source order", () => {
    expect(byName.orderAndFields.routes).toEqual([
      { path: "/artwork/:artworkID", name: "Artwork", order: 0 },
      { path: "/artist/:artistID", name: "Artist", order: 1 },
    ])
    expect(byName.orderAndFields.warnings).toEqual([])
  })

  it("resolves webViewRoute(...) to ReactWebView", () => {
    expect(byName.webView.routes).toEqual([{ path: "/terms", name: "ReactWebView", order: 0 }])
  })

  it("resolves a modally-presented webViewRoute to ModalWebView", () => {
    expect(byName.modalWebView.routes).toEqual([
      { path: "/conditions-of-sale", name: "ModalWebView", order: 0 },
    ])
  })

  it("preserves a leading-param alias path verbatim", () => {
    expect(byName.leadingParamAlias.routes).toEqual([
      { path: "/:profile_id_ignored/artist/:artistID", name: "Artist", order: 0 },
    ])
  })

  it("unwraps a defineRoutes([...]) call", () => {
    expect(byName.defineRoutesWrapper.routes).toEqual([{ path: "/x", name: "X", order: 0 }])
  })

  it("warns on an element it can't parse (missing name)", () => {
    expect(byName.missingName.routes).toEqual([])
    expect(byName.missingName.warnings).toEqual([
      expect.stringContaining("Unparsed eigen route element"),
    ])
  })

  it("throws when artsyDotNetRoutes is absent", () => {
    expect(byName.missingArray.error).toContain("Could not locate artsyDotNetRoutes")
  })
})
