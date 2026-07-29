// Danger transpiles dangerfile.ts through the legacy TypeScript compiler API
// (ts.transpileModule), which typescript@7's native compiler package no longer
// exposes. Preload this file (NODE_OPTIONS="--require ...") so that
// require("typescript") resolves to the TS 5 compiler API, installed as the
// "typescript5" alias package. Type-checking (yarn type-check) still runs on
// typescript@7.
const Module = require("module")

const ts5 = require("typescript5")
const ts7Path = require.resolve("typescript")

const shim = new Module(ts7Path)
shim.exports = ts5
shim.loaded = true
require.cache[ts7Path] = shim
