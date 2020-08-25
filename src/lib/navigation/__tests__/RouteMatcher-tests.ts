import { RouteMatcher } from "../RouteMatcher"

describe(RouteMatcher, () => {
  it("throws an error if you try to give a route that looks wrong", () => {
    // no leading slash
    expect(() => new RouteMatcher("hello", "Hello")).toThrow()

    // trailing slash
    expect(() => new RouteMatcher("/hello/", "Hello")).toThrow()

    // double slash
    expect(() => new RouteMatcher("/hello//other", "Hello")).toThrow()

    // double colon
    expect(() => new RouteMatcher("/hello/::param", "Hello")).toThrow()

    // weird chars
    expect(() => new RouteMatcher("/hello/ba$nana", "Hello")).toThrow()

    // nothing
    expect(() => new RouteMatcher("", "Hello")).toThrow()

    // wildcard in the wrong place
    expect(() => new RouteMatcher("/*/hello", "Hello")).toThrow()

    // wildcard in the wrong place
    expect(() => new RouteMatcher("/greetings/*/hello", "Hello")).toThrow()

    // double wildcard
    expect(() => new RouteMatcher("/greetings/**", "Hello")).toThrow()

    // colon wildcard
    expect(() => new RouteMatcher("/greetings/:*", "Hello")).toThrow()
    expect(() => new RouteMatcher("/:*/hello", "Hello")).toThrow()
  })

  it("does not throw errors for routes that look right", () => {
    // tslint:disable-next-line:no-unused-expression
    new RouteMatcher("/", "Hello")
    // tslint:disable-next-line:no-unused-expression
    new RouteMatcher("/hello", "Hello")
    // tslint:disable-next-line:no-unused-expression
    new RouteMatcher("/hello/:id", "Hello")
    // tslint:disable-next-line:no-unused-expression
    new RouteMatcher("/:id/hello", "Hello")
    // tslint:disable-next-line:no-unused-expression
    new RouteMatcher("/:id/Capital", "Hello")
    // tslint:disable-next-line:no-unused-expression
    new RouteMatcher("/:id/Capital32", "Hello")
    // tslint:disable-next-line:no-unused-expression
    new RouteMatcher("/324/:Capital78/20f38h9s/:banana", "Hello")
  })

  it("returns null when there's no match", () => {
    expect(new RouteMatcher("/", "Hello").match(["hello"])).toBe(null)
    expect(new RouteMatcher("/", "Hello").match(["hello", "there"])).toBe(null)
    expect(new RouteMatcher("/hello", "Hello").match(["goodbye"])).toBe(null)
    expect(new RouteMatcher("/hello/goodbye", "Hello").match(["goodbye"])).toBe(null)
    expect(new RouteMatcher("/:hello/goodbye", "Hello").match(["goodbye"])).toBe(null)
    expect(new RouteMatcher("/:id", "Hello").match([])).toBe(null)
  })

  it("returns path params when there's a match", () => {
    expect(new RouteMatcher("/", "Hello").match([])).toEqual({})
    expect(new RouteMatcher("/home", "Hello").match(["home"])).toEqual({})
    expect(new RouteMatcher("/:id", "Hello").match(["david"])).toEqual({ id: "david" })
    expect(new RouteMatcher("/:id/home", "Hello").match(["david", "home"])).toEqual({ id: "david" })
    expect(new RouteMatcher("/home/:id", "Hello").match(["home", "stephen"])).toEqual({ id: "stephen" })
    expect(
      new RouteMatcher("/home/:id/thing/:slug/other_thing/:slug2", "Hello").match([
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
      new RouteMatcher("/home/:id/thing/:slug", "Hello", ({ id, slug }) => ({
        string: `the id is ${id} and the slug is ${slug}`,
      })).match(["home", "stephen", "thing", "blah"])
    ).toMatchInlineSnapshot(`
      Object {
        "string": "the id is stephen and the slug is blah",
      }
    `)
  })

  it("allows supplying a wildcard", () => {
    expect(new RouteMatcher("/home/*", "Hello").match(["home", "stephen", "king"])).toEqual({
      "*": "stephen/king",
    })
  })
})
