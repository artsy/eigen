import { act } from "@testing-library/react-native"
import { DefaultMockResolvers, resetMockResolverState } from "app/utils/tests/mockEdges"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"

/**
 * @deprecated
 * Please use `setupTestWrapper` and destrucure
 * const { mockResolveLastOperation } = renderWithRelay() instead
 */
export function resolveMostRecentRelayOperation(
  mockEnvironment: ReturnType<typeof createMockEnvironment>,
  mockResolvers?: MockResolvers
) {
  resetMockResolverState()
  act(() => {
    // Wrapping in act will ensure that components
    // are fully updated to their final state.
    // https://relay.dev/docs/guides/testing-relay-components/
    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, { ...DefaultMockResolvers, ...mockResolvers })
    )
  })
}
