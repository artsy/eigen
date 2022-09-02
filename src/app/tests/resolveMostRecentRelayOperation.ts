import { act } from "@testing-library/react-native"
import { getMockRelayEnvironment } from "app/relay/defaultEnvironment"
import { isEmpty, takeRight } from "lodash"
import { GraphQLResponse, OperationDescriptor } from "relay-runtime"
import { MockPayloadGenerator } from "relay-test-utils"
import { MockResolverContext, MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"

let counters: { [path: string]: number } = {}
const reset = () => {
  counters = {}
  paths = {}
}
const generateID = (pathComponents: readonly string[] | undefined) => {
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
 * Resolves the most recent relay operation with resolvers.
 * Gets the resolvers like:
 * ```
 * {
 *   Artist: () => ({
 *     name: "Banksy",
 *     slug: "banksy",
 *   })
 * }
 * ```
 */
export function resolveMostRecentRelayOperation(mockResolvers?: MockResolvers) {
  reset()
  act(() => {
    // Wrapping in act will ensure that components
    // are fully updated to their final state.
    // https://relay.dev/docs/guides/testing-relay-components/
    getMockRelayEnvironment().mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(
        operation,
        !isEmpty(mockResolvers) ? { ...DefaultMockResolvers, ...mockResolvers } : {}
      )
    )
  })
}

/**
 * Resolves the most recent relay operation with a raw payload.
 * Gets the payload like:
 * ```
 * {
 *   data: undefined,
 *   errors: [
 *     { message: "404" },
 *   ],
 * }
 * ```
 * or
 * ```
 * {
 *   data: {
 *     artist: {
 *       name: "Banksy",
 *       slug: "banksy",
 *     },
 *   },
 *   errors: [],
 * }
 * ```
 */
export function resolveMostRecentRelayOperationRawPayload(payload: GraphQLResponse) {
  reset()
  act(() => {
    // Wrapping in act will ensure that components
    // are fully updated to their final state.
    // https://relay.dev/docs/guides/testing-relay-components/
    getMockRelayEnvironment().mock.resolveMostRecentOperation(payload)
  })
}

export function rejectMostRecentRelayOperation(
  error: Error | ((operation: OperationDescriptor) => Error)
) {
  act(() => {
    getMockRelayEnvironment().mock.rejectMostRecentOperation(error)
  })
}
