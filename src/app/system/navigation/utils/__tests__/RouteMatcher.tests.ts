import { RouteMatcher } from "app/system/navigation/utils/RouteMatcher"

describe(RouteMatcher, () => {
  it("throws an error if you try to give a route that looks wrong", () => {
    // no leading slash
    expect(() => new RouteMatcher("hello", "Home")).toThrow()

    // trailing slash
    expect(() => new RouteMatcher("/hello/", "Home")).toThrow()

    // double slash
    expect(() => new RouteMatcher("/hello//other", "Home")).toThrow()

    // double colon
    expect(() => new RouteMatcher("/hello/::param", "Home")).toThrow()

    // weird chars
    expect(() => new RouteMatcher("/hello/ba$nana", "Home")).toThrow()

    // nothing
    expect(() => new RouteMatcher("", "Home")).toThrow()

    // wildcard in the wrong place
    expect(() => new RouteMatcher("/*/hello", "Home")).toThrow()

    // wildcard in the wrong place
    expect(() => new RouteMatcher("/greetings/*/hello", "Home")).toThrow()

    // double wildcard
    expect(() => new RouteMatcher("/greetings/**", "Home")).toThrow()

    // colon wildcard
    expect(() => new RouteMatcher("/greetings/:*", "Home")).toThrow()
    expect(() => new RouteMatcher("/:*/hello", "Home")).toThrow()
  })

  it("does not throw errors for routes that look right", () => {
    new RouteMatcher("/", "Home")
    new RouteMatcher("/hello", "Home")
    new RouteMatcher("/hello/:id", "Home")
    new RouteMatcher("/:id/hello", "Home")
    new RouteMatcher("/:id/Capital", "Home")
    new RouteMatcher("/:id/Capital32", "Home")
    new RouteMatcher("/324/:Capital78/20f38h9s/:banana", "Home")
  })

  it("returns null when there's no match", () => {
    expect(new RouteMatcher("/", "Home").match(["hello"])).toBe(null)
    expect(new RouteMatcher("/", "Home").match(["hello", "there"])).toBe(null)
    expect(new RouteMatcher("/hello", "Home").match(["goodbye"])).toBe(null)
    expect(new RouteMatcher("/hello/goodbye", "Home").match(["goodbye"])).toBe(null)
    expect(new RouteMatcher("/:hello/goodbye", "Home").match(["goodbye"])).toBe(null)
    expect(new RouteMatcher("/:id", "Home").match([])).toBe(null)
  })

  it("returns path params when there's a match", () => {
    expect(new RouteMatcher("/", "Home").match([])).toEqual({})
    expect(new RouteMatcher("/home", "Home").match(["home"])).toEqual({})
    expect(new RouteMatcher("/:id", "Home").match(["david"])).toEqual({ id: "david" })
    expect(new RouteMatcher("/:id/home", "Home").match(["david", "home"])).toEqual({ id: "david" })
    expect(new RouteMatcher("/home/:id", "Home").match(["home", "stephen"])).toEqual({
      id: "stephen",
    })
    expect(
      new RouteMatcher("/home/:id/thing/:slug/other_thing/:slug2", "Home").match([
        "home",
        "stephen",
        "thing",
        "blah",
        "other_thing",
        "blah2",
      ])
    ).toEqual({ id: "stephen", slug: "blah", slug2: "blah2" })
  })

  it("allows supplying a params mapper function", () => {
    expect(
      new RouteMatcher("/home/:id/thing/:slug", "Home", ({ id, slug }) => ({
        string: `the id is ${id} and the slug is ${slug}`,
      })).match(["home", "stephen", "thing", "blah"])
    ).toMatchInlineSnapshot(`
      {
        "string": "the id is stephen and the slug is blah",
      }
    `)
  })

  it("allows supplying a wildcard", () => {
    expect(new RouteMatcher("/home/*", "Home").match(["home", "stephen", "king"])).toEqual({
      "*": "stephen/king",
    })
  })
})
