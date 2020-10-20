import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

export type RelayMockEnvironment = ReturnType<typeof createMockEnvironment>

export const mockEnvironmentPayload = (mockEnvironment: RelayMockEnvironment, passedProps = {}) => {
  mockEnvironment.mock.resolveMostRecentOperation((operation) => MockPayloadGenerator.generate(operation, passedProps))
}
