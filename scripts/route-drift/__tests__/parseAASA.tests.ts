import { toMatcher } from "../parseAASA"

describe("toMatcher", () => {
  it.each([
    // "/foo/*" excludes /foo/ and anything under it, but NOT the bare /foo
    ["/news/*", "/news/foo", true],
    ["/news/*", "/news/", true],
    ["/news/*", "/news", false],
    ["/news/*", "/newsfoo", false],
    // "/foo*" is a bare prefix match (zero-or-more chars, no slash boundary)
    ["/gender-equality*", "/gender-equality", true],
    ["/gender-equality*", "/gender-equality-2024", true],
    ["/gender-equality*", "/gender", false],
    // exact match
    ["/login", "/login", true],
    ["/login", "/login/x", false],
    ["/login", "/loginx", false],
    // mid-string wildcard -> regex
    ["/a/*/b", "/a/x/b", true],
    ["/a/*/b", "/a/b", false],
  ])("matcher(%p)(%p) === %p", (pattern, path, expected) => {
    expect(toMatcher(pattern)(path)).toEqual(expected)
  })
})
