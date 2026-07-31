import { classifyURL, compileEigenRoutes } from "../match"

// match.ts imports only `url` + RouteMatcher (EigenRoute is `import type`), so
// there's no `typescript` pull-in — this runs in-process, no tsx harness.
const route = (path: string, name: string) => ({ path, name, order: 0 })
const at = (path: string) => `https://www.artsy.net${path}`

describe("classifyURL", () => {
  it("is first-match-wins — a specific route ordered before the /:slug catch-all wins", () => {
    const specificFirst = compileEigenRoutes([
      route("/artworks", "Artworks"),
      route("/:slug", "VanityURLEntity"),
    ])
    expect(classifyURL(at("/artworks"), specificFirst).module).toBe("Artworks")

    // Reverse the order and the catch-all shadows it — proving order decides.
    const catchAllFirst = compileEigenRoutes([
      route("/:slug", "VanityURLEntity"),
      route("/artworks", "Artworks"),
    ])
    expect(classifyURL(at("/artworks"), catchAllFirst).module).toBe("VanityURLEntity")
  })

  it("resolves a native route to its module and marks it native", () => {
    const compiled = compileEigenRoutes([route("/artwork/:artworkID", "Artwork")])
    expect(classifyURL(at("/artwork/andy-warhol-soup-can"), compiled)).toEqual({
      module: "Artwork",
      matchedPath: "/artwork/:artworkID",
      isNative: true,
    })
  })

  it("classifies the /:slug VanityURLEntity catch-all as non-native", () => {
    const compiled = compileEigenRoutes([route("/:slug", "VanityURLEntity")])
    expect(classifyURL(at("/some-vanity-slug"), compiled)).toEqual({
      module: "VanityURLEntity",
      matchedPath: "/:slug",
      isNative: false,
    })
  })

  it("matches a trailing-wildcard route across the remaining segments", () => {
    const compiled = compileEigenRoutes([route("/artist/:artistID/*", "Artist")])
    expect(classifyURL(at("/artist/banksy/auction-results"), compiled)).toEqual({
      module: "Artist",
      matchedPath: "/artist/:artistID/*",
      isNative: true,
    })
  })

  it("falls back to a non-native ReactWebView when nothing matches", () => {
    const compiled = compileEigenRoutes([route("/artwork/:artworkID", "Artwork")])
    expect(classifyURL(at("/totally/unknown/path"), compiled)).toEqual({
      module: "ReactWebView",
      matchedPath: null,
      isNative: false,
    })
  })

  it("treats webview modules (ModalWebView) as non-native", () => {
    const compiled = compileEigenRoutes([route("/terms", "ModalWebView")])
    const res = classifyURL(at("/terms"), compiled)
    expect(res.module).toBe("ModalWebView")
    expect(res.isNative).toBe(false)
  })
})
