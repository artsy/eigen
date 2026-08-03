import { getDomainMap } from "app/Navigation/utils/getDomainMap"

describe("getDomainMap", () => {
  it("returns non-empty matcher lists for the artsy.net and live domains", () => {
    const map = getDomainMap()

    expect(map["artsy.net"]?.length).toBeGreaterThan(0)
    expect(map["live.artsy.net"]?.length).toBeGreaterThan(0)
  })

  it("points the artsy.net web hosts at the same cached array", () => {
    const map = getDomainMap()

    expect(map["www.artsy.net"]).toBe(map["artsy.net"])
    expect(map["staging.artsy.net"]).toBe(map["artsy.net"])
    expect(map["live-staging.artsy.net"]).toBe(map["live.artsy.net"])
  })

  it("memoizes the matcher arrays across calls (built once, not per call)", () => {
    const first = getDomainMap()
    const second = getDomainMap()

    // Same array references across calls => the RouteMatchers are not rebuilt on
    // every getDomainMap() call. This is the perf guarantee we want to lock in;
    // reverting to a per-call rebuild would make these fail.
    expect(second["artsy.net"]).toBe(first["artsy.net"])
    expect(second["live.artsy.net"]).toBe(first["live.artsy.net"])
  })
})
