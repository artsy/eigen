import { fireEvent, screen } from "@testing-library/react-native"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { createMockEnvironment } from "relay-test-utils"
import { Activity } from "./Activity"

jest.mock("@artsy/palette-mobile", () => {
  const palette = jest.requireActual("@artsy/palette-mobile")
  return {
    ...palette,
    Tabs: {
      ...palette.Tabs,
      TabsWithHeader: (props: any) => {
        // Simulate the tab change event by calling the prop immediately
        if (props.onTabChange) {
          props.onTabChange({ tabName: "Alerts" })
        }
        return <>{props.children}</>
      },
    },
  }
})

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

    expect(screen.getByText("Notification One")).toBeTruthy()
    expect(screen.getByText("Notification Two")).toBeTruthy()
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

    expect(screen.getByText("Notification One")).toBeTruthy()
    expect(screen.getByText("Notification Two")).toBeTruthy()
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

    expect(screen.getByText("Notification One")).toBeTruthy()
    expect(screen.getByText("Notification Two")).toBeTruthy()
    expect(screen.queryByText("Notification Three")).toBeNull()
  })

  it("should track event when the tab is tapped", () => {
    renderWithHookWrappersTL(<Activity />, mockEnvironment)

    fireEvent.press(screen.getByText("Alerts"))

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
        item: {
          viewingRoomsConnection: {
            totalCount: 1,
          },
        },
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
