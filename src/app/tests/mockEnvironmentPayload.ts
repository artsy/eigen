import { takeRight } from "lodash"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MockResolverContext, MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"

let counters: { [path: string]: number } = {}
const reset = () => {
  counters = {}
  paths = {}
}
export const generateID = (pathComponents: readonly string[] | undefined) => {
  const path: string = pathComponents?.join(".") ?? "_GLOBAL_"
  const currentCounter = counters[path]
  counters[path] = currentCounter === undefined ? 1 : currentCounter + 1
  return counters[path]
}

/**
 * Used to generate results in an array.
 * Usage: ```
 * Artist: () => ({
 *   auctionResultsConnection: {
 *     edges: mockEdges(10), // <- this will generate an array with 10 results, all prefilled
 *   }
 * })
 * ```
 */
export const mockEdges = (length: number) => new Array(length).fill({ node: {} })

let paths: { [name: string]: string } = {}
const goodMockResolver = (ctx: MockResolverContext) => {
  const makePrefix = (path: string) => takeRight(path.split("."), length).join(".")

  const fullpath = (ctx.path?.join(".") ?? "_GLOBAL_").replace(".edges.node", "")
  let length = 1
  let prefix = makePrefix(fullpath)

  while (Object.keys(paths).includes(prefix) && paths[prefix] !== fullpath) {
    length += 1
    prefix = makePrefix(fullpath)
  }
  paths[prefix] = fullpath

  return `${prefix}-${generateID(ctx.path)}`
}
export const DefaultMockResolvers: MockResolvers = {
  ID: (ctx) => goodMockResolver(ctx),
  String: (ctx) => goodMockResolver(ctx),
}

export function mockEnvironmentPayload(
  mockEnvironment: ReturnType<typeof createMockEnvironment>,
  mockResolvers?: MockResolvers
) {
  reset()
  mockEnvironment.mock.resolveMostRecentOperation((operation) =>
    MockPayloadGenerator.generate(operation, { ...DefaultMockResolvers, ...mockResolvers })
  )
}
