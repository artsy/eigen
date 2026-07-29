import { execFileSync } from "child_process"
import { join } from "path"

// A plain in-process import can't test this: Jest runs under the react-native
// preset, so the RN module graph is always present and would mask a runtime
// import in RouteMatcher.ts. We reproduce the real `yarn route-drift` path by
// loading match.ts in a child tsx process instead.
const TSX = join(__dirname, "../../../node_modules/.bin/tsx")
const CHECK_SCRIPT = join(__dirname, "../checkMatchIsolation.ts")

describe("match.ts isolation", () => {
  it("loads RouteMatcher under tsx without the React Native module graph", () => {
    let output: string
    try {
      output = execFileSync(TSX, [CHECK_SCRIPT], {
        encoding: "utf8",
        stdio: "pipe",
        timeout: 60_000,
      })
    } catch (e: any) {
      throw new Error(
        "match.ts failed to load under tsx without the React Native module graph.\n" +
          "A runtime (non-`import type`) import was likely added to RouteMatcher.ts or match.ts.\n" +
          "Keep their `app/...` imports type-only so scripts/route-drift can load them in isolation.\n\n" +
          `${e.stdout ?? ""}${e.stderr ?? ""}`
      )
    }
    expect(output).toContain("route-matcher-isolation-ok")
  })
})
