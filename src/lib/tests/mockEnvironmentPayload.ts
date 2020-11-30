import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"

const counters: { [path: string]: number } = {}
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
 *     edges: mockArray(10), // <- this will generate an array with 10 results, all prefilled
 *   }
 * })
 * ```
 */
export const mockArray = (length: number) => new Array(length).fill({ node: {} })

export const DefaultMockResolvers: MockResolvers = {
  String: (ctx) => `${ctx.name}-${generateID(ctx.path)}`,
}

export const mockEnvironmentPayload = (
  mockEnvironment: ReturnType<typeof createMockEnvironment>,
  mockResolvers: MockResolvers = DefaultMockResolvers
) => {
  mockEnvironment.mock.resolveMostRecentOperation((operation) =>
    MockPayloadGenerator.generate(operation, mockResolvers)
  )
}
