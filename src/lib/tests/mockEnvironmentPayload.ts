import { capitalize, isFunction, takeRight, without } from "lodash"
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

const DefaultMockResolvers: MockResolvers = {
  ID: (ctx) => goodMockResolver(ctx),
  String: (ctx) => goodMockResolver(ctx),
}

/**
 * Relay expects the resolver argument in the form of:
 * {
 *   Me: () => ({
 *     lotStandings: []
 *   })
 * }
 * but as a developer, I want to write it as:
 * {
 *   me: {
 *     lotStandings: []
 *   }
 * }
 * so that it makes sense, and it's the same as the actual graphql query.
 * Basically, relay should be doing this, but 🤷‍♂️.
 *
 * Still there are some places where we need the args like `ctx`, and we in these cases we keep the capitalization and the function.
 * Mostly this is needed in special keys like `ID` and `String` and `Boolean`, but if we ever need it for other cases, it is supported.
 */
const massageForRelay = (resolvers: Record<string, any>): MockResolvers => {
  const massagedResolvers: MockResolvers = {}

  Object.keys(DefaultMockResolvers).forEach((key) => {
    if (resolvers[key] !== undefined) {
      massagedResolvers[key] = resolvers[key]
    }
  })

  const restKeys = without(Object.keys(resolvers), ...Object.keys(DefaultMockResolvers))
  restKeys.forEach((key) => {
    // keep the function tests working. we might use the args at some point, for some tests.
    if (isFunction(resolvers[key])) {
      massagedResolvers[key] = resolvers[key]
    } else {
      massagedResolvers[capitalize(key)] = () => resolvers[key]
    }
  })

  return massagedResolvers
}

export const mockEnvironmentPayload = (
  mockEnvironment: ReturnType<typeof createMockEnvironment>,
  mockResolvers?: MockResolvers | Record<string, any>
) => {
  reset()
  mockEnvironment.mock.resolveMostRecentOperation((operation) =>
    MockPayloadGenerator.generate(operation, massageForRelay({ ...DefaultMockResolvers, ...mockResolvers }))
  )
}

// tslint:disable-next-line: variable-name
export const _test_massageForRelay = massageForRelay
// tslint:disable-next-line: variable-name
export const _test_DefaultMockResolvers = DefaultMockResolvers
