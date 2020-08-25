import { matchRoute } from "lib/navigation/routes"

describe("artsy.net routes", () => {
  it(`routes to Home`, () => {
    expect(matchRoute("/")).toEqual({
      module: "Home",
      params: {},
    })
    expect(matchRoute("")).toEqual({
      module: "Home",
      params: {},
    })
  })

  it(`routes to Artworks`, () => {
    expect(matchRoute("/artwork/josef-albers-homage-to-the-square")).toEqual({
      module: "Artwork",
      params: { id: "josef-albers-homage-to-the-square" },
    })
  })
})

describe("live auction routes", () => {
  it("are passed throughh", () => {
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
