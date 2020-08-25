import { matchRoute } from "lib/navigation/routes"

describe(matchRoute, () => {
  it(`routes to Home`, () => {
    expect(matchRoute("/")).toMatchInlineSnapshot(`
      Object {
        "module": "Home",
        "params": Object {},
      }
    `)
    expect(matchRoute("")).toMatchInlineSnapshot(`
      Object {
        "module": "Home",
        "params": Object {},
      }
    `)
  })
  it(`routes to Artworks`, () => {
    expect(matchRoute("/artwork/josef-albers-homage-to-the-square")).toMatchInlineSnapshot(`
      Object {
        "module": "Artwork",
        "params": Object {
          "slug": "josef-albers-homage-to-the-square",
        },
      }
    `)
  })
})
