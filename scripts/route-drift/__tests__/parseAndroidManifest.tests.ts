import { matchesRule } from "../parseAndroidManifest"

describe("matchesRule", () => {
  it.each([
    // exact path
    [{ kind: "path" as const, value: "/news" }, "/news", true],
    [{ kind: "path" as const, value: "/news" }, "/news/x", false],
    // pathPrefix is substring-prefix (Android semantics — not segment-aware)
    [{ kind: "pathPrefix" as const, value: "/collect" }, "/collect", true],
    [{ kind: "pathPrefix" as const, value: "/collect" }, "/collect/x", true],
    [{ kind: "pathPrefix" as const, value: "/collect" }, "/collection", true],
    [{ kind: "pathPrefix" as const, value: "/collect" }, "/foo", false],
    // pathSuffix
    [{ kind: "pathSuffix" as const, value: ".pdf" }, "/a/b.pdf", true],
    [{ kind: "pathSuffix" as const, value: ".pdf" }, "/a/b.png", false],
    // pathPattern: Android glob (. = any char, * = zero-or-more of preceding)
    [{ kind: "pathPattern" as const, value: "/a/.*" }, "/a/xyz", true],
    [{ kind: "pathPattern" as const, value: "/a/.*" }, "/b", false],
    // advanced-glob escape: `\.` is a literal dot, not "backslash + any char"
    [{ kind: "pathAdvancedPattern" as const, value: "/a\\.pdf" }, "/a.pdf", true],
    [{ kind: "pathAdvancedPattern" as const, value: "/a\\.pdf" }, "/axpdf", false],
  ])("matchesRule(%p, %p) === %p", (rule, pathname, expected) => {
    expect(matchesRule(pathname, rule)).toEqual(expected)
  })
})
