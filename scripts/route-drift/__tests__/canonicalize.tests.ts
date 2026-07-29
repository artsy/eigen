import { expandOptionals, joinPaths, stripRegex } from "../canonicalize"

describe("stripRegex", () => {
  it.each([
    ["exhibitors(.*)?", "exhibitors"],
    ["booths(.*)?", "booths"],
    ["/fair/:slug/exhibitors(.*)?", "/fair/:slug/exhibitors"],
    ["foo(a|b)bar", "foobar"],
    ["a//b", "a/b"],
    ["plain", "plain"],
  ])("strips %p -> %p", (input, expected) => {
    expect(stripRegex(input)).toEqual(expected)
  })
})

describe("joinPaths", () => {
  it.each([
    [["/fair", "artworks"], "/fair/artworks"],
    [["/fair/", "/artworks"], "/fair/artworks"],
    [["fair", "artworks"], "/fair/artworks"],
    [["", "artworks"], "/artworks"],
    // index / empty child collapses to the parent prefix
    [["/fair", ""], "/fair"],
    [["/fair", "/"], "/fair"],
    [["", ""], "/"],
  ])("joins %p -> %p", ([prefix, path], expected) => {
    expect(joinPaths(prefix, path)).toEqual(expected)
  })
})

describe("expandOptionals", () => {
  it("returns the path unchanged when there is no optional param", () => {
    expect(expandOptionals("/collect/:medium")).toEqual(["/collect/:medium"])
  })

  it("expands a trailing optional into with- and without-variants", () => {
    expect(expandOptionals("/collect/:medium?")).toEqual(["/collect/:medium", "/collect"])
  })

  it("keeps only the present variant for a non-terminal optional", () => {
    expect(expandOptionals("/fair/:slug?/exhibitors")).toEqual(["/fair/:slug/exhibitors"])
  })
})
