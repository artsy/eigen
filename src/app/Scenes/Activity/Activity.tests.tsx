import { screen } from "@testing-library/react-native"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
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
    renderWithHookWrappersTL(<Activity />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      NotificationConnection: () => notifications,
    })

    await flushPromiseQueue()

    expect(screen.queryByText("Notification One")).toBeTruthy()
    expect(screen.queryByText("Notification Two")).toBeTruthy()
  })

  it("renders tabs", async () => {
    renderWithHookWrappersTL(<Activity />, mockEnvironment)
    resolveMostRecentRelayOperation(mockEnvironment, {})

    await flushPromiseQueue()

    expect(screen.getByText("All")).toBeTruthy()
    expect(screen.getByText("Alerts")).toBeTruthy()
  })

  it("renders empty states", async () => {
    renderWithHookWrappersTL(<Activity />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      NotificationConnection: () => ({
        edges: [],
      }),
    })

    await flushPromiseQueue()

    expect(screen.getByLabelText("Activities are empty")).toBeTruthy()
  })

  it("should display all notifications", async () => {
    renderWithHookWrappersTL(<Activity />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      NotificationConnection: () => notifications,
    })
    await flushPromiseQueue()

    expect(screen.queryByText("Notification One")).toBeTruthy()
    expect(screen.queryByText("Notification Two")).toBeTruthy()
  })

  it("should hide artworks based notifications that don't have artworks", async () => {
    renderWithHookWrappersTL(<Activity />, mockEnvironment)

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

    expect(screen.queryByText("Notification One")).toBeTruthy()
    expect(screen.queryByText("Notification Two")).toBeTruthy()
    expect(screen.queryByText("Notification Three")).toBeNull()
  })

  // fit("should track event when the tab is tapped", () => {
  //   const { getByText } = renderWithHookWrappersTL(<Activity />, mockEnvironment)

  //   // TODO: Fix this test
  //   fireEvent.press(getByText("Alerts"))

  //   expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
  //     [
  //       {
  //         "action": "clickedActivityPanelTab",
  //         "tab_name": "Alerts",
  //       },
  //     ]
  //   `)
  // })
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
