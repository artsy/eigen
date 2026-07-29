// Guard: match.ts (and the RouteMatcher it imports) must load under tsx WITHOUT
// the React Native module graph — that's how `yarn route-drift` runs. It works
// only because RouteMatcher.ts and match.ts keep their app imports type-only
// (`import type`), so esbuild erases them. If a runtime import sneaks in, this
// script throws at import time and exits non-zero.
//
// Run directly (`yarn tsx scripts/route-drift/checkMatchIsolation.ts`) or via
// matchIsolation.tests.ts, which spawns it in a child tsx process — a plain
// Jest test can't reproduce the failure because Jest provides the RN graph.
import { compileEigenRoutes } from "./match"

compileEigenRoutes([])
console.log("route-matcher-isolation-ok")
