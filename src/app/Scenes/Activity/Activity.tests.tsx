import { fireEvent } from "@testing-library/react-native"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { createMockEnvironment } from "relay-test-utils"
import { Activity } from "./Activity"


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

  it("renders tabs", async () => {
    const { getByText } = renderWithHookWrappersTL(<Activity />, mockEnvironment)

    expect(getByText("All")).toBeTruthy()
    expect(getByText("Alerts")).toBeTruthy()
  })

  it("renders empty states", async () => {
    const { getByLabelText } = renderWithHookWrappersTL(<Activity />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      NotificationConnection: () => ({
        edges: [],
      }),
    })

    await flushPromiseQueue()

    expect(getByLabelText("Activities are empty")).toBeTruthy()
  })

  it("should display all notifications", async () => {
    const { queryByText } = renderWithHookWrappersTL(<Activity />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      NotificationConnection: () => notifications,
    })
    await flushPromiseQueue()

    expect(queryByText("Notification One")).toBeTruthy()
    expect(queryByText("Notification Two")).toBeTruthy()
  })

  it("should hide artworks based notifications that don't have artworks", async () => {
    const { queryByText } = renderWithHookWrappersTL(<Activity />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      NotificationConnection: () => ({
        edges: [
          ...notifications.edges,
          {
            node: {
              notificationType: "ARTWORK_PUBLISHED",
              title: "Notification Three",
              artworks: {
                totalCount: 0,
              },
            },
          },
        ],
      }),
    })
    await flushPromiseQueue()

    expect(queryByText("Notification One")).toBeTruthy()
    expect(queryByText("Notification Two")).toBeTruthy()
    expect(queryByText("Notification Three")).toBeNull()
  })

  it("should track event when the tab is tapped", () => {
    const { getByText } = renderWithHookWrappersTL(<Activity />, mockEnvironment)

    fireEvent.press(getByText("Alerts"))

    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "action": "clickedActivityPanelTab",
          "tab_name": "Alerts",
        },
      ]
    `)
  })
})

const notifications = {
  edges: [
    {
      node: {
        title: "Notification One",
        notificationType: "VIEWING_ROOM_PUBLISHED",
      },
    },
    {
      node: {
        title: "Notification Two",
        notificationType: "ARTWORK_ALERT",
        artworks: {
          totalCount: 3,
        },
      },
    },
  ],
}
