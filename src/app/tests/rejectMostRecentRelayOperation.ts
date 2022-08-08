import { act } from "@testing-library/react-native"
import { OperationDescriptor } from "relay-runtime"
import { createMockEnvironment } from "relay-test-utils"

export function rejectMostRecentRelayOperation(
  mockEnvironment: ReturnType<typeof createMockEnvironment>,
  error: Error | ((operation: OperationDescriptor) => Error)
) {
  act(() => {
    mockEnvironment.mock.rejectMostRecentOperation(error)
  })
}
