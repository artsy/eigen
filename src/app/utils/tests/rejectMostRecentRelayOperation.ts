import { act } from "@testing-library/react-native"
import { OperationDescriptor } from "relay-runtime"
import { createMockEnvironment } from "relay-test-utils"

/**
 * @deprecated
 * Please use `setupTestWrapper` and destrucure
 * const { mockRejectLastOperation } = renderWithRelay() instead
 */
export function rejectMostRecentRelayOperation(
  mockEnvironment: ReturnType<typeof createMockEnvironment>,
  error: Error | ((operation: OperationDescriptor) => Error)
) {
  act(() => {
    mockEnvironment.mock.rejectMostRecentOperation(error)
  })
}
