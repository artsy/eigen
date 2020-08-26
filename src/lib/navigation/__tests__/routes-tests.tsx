import { matchRoute } from "lib/navigation/routes"

describe("artsy.net routes", () => {
  it(`routes to Home`, () => {
    const expected = {
      module: "Home",
      params: {},
    }
    expect(matchRoute("/")).toEqual(expected)
    expect(matchRoute("")).toEqual(expected)
    expect(matchRoute("//")).toEqual(expected)
    expect(matchRoute("https://www.artsy.net/")).toEqual(expected)
    expect(matchRoute("https://artsy.net/")).toEqual(expected)
    expect(matchRoute("https://staging.artsy.net/")).toEqual(expected)
  })

  it(`routes to Artworks`, () => {
    expect(matchRoute("/artwork/josef-albers-homage-to-the-square")).toEqual({
      module: "Artwork",
      params: { id: "josef-albers-homage-to-the-square" },
    })
  })
})

describe("live auction routes", () => {
  it("are passed through", () => {
    expect(matchRoute("https://live.artsy.net/sale/david")).toMatchInlineSnapshot(`
      Object {
        "module": "LiveAuction",
        "params": Object {
          "*": "sale/david",
        },
      }
    `)
  })
})

describe("other domains", () => {
  it("open in a browser", () => {
    expect(matchRoute("https://google.com")).toEqual({
      module: "DeviceWebBrowser",
      params: {
        url: "https://google.com",
      },
    })
  })
})
