import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { createMockEnvironment } from "relay-test-utils"
import { Activity } from "./Activity"

jest.unmock("react-relay")

describe("Activity", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("renders items", async () => {
    const { getByText } = renderWithHookWrappersTL(<Activity />, mockEnvironment)

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
