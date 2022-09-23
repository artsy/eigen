import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { createMockEnvironment } from "relay-test-utils"
import { Activities } from "./Activities"

jest.unmock("react-relay")

describe("Activities", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("renders items", async () => {
    const { getByText } = renderWithHookWrappersTL(<Activities />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      NotificationConnection: () => notifications,
    })

    await flushPromiseQueue()

    expect(getByText("Notification One")).toBeTruthy()
    expect(getByText("Notification Two")).toBeTruthy()
  })
})

const notifications = {
  edges: [
    {
      node: {
        title: "Notification One",
      },
    },
    {
      node: {
        title: "Notification Two",
      },
    },
  ],
}
