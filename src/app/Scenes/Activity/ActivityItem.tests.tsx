import { fireEvent } from "@testing-library/react-native"
import { ActivityItem_Test_Query } from "__generated__/ActivityItem_Test_Query.graphql"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, useLazyLoadQuery } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { ActivityItem } from "./ActivityItem"

const targetUrl = "/artist/banksy/works-for-sale?sort=-published_at"
const alertTargetUrl =
  "/artist/banksy/works-for-sale?search_criteria_id=searchCriteriaId&sort=-published_at"

describe("ActivityItem", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const TestRenderer = () => {
    const data = useLazyLoadQuery<ActivityItem_Test_Query>(
      graphql`
        query ActivityItem_Test_Query {
          notificationsConnection(first: 1) {
            edges {
              node {
                ...ActivityItem_item
              }
            }
          }
        }
      `,
      {}
    )
    const items = extractNodes(data.notificationsConnection)

    return <ActivityItem item={items[0]} />
  }

  it("should the basic info", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Notification: () => notification,
    })
    await flushPromiseQueue()

    expect(getByText("Notification Title")).toBeTruthy()
    expect(getByText("Notification Message")).toBeTruthy()
  })

  it("should render the formatted publication date", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Notification: () => notification,
    })
    await flushPromiseQueue()

    expect(getByText("2 days ago")).toBeTruthy()
  })

  it("should render artwork images", async () => {
    const { getAllByLabelText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Notification: () => notification,
    })
    await flushPromiseQueue()

    expect(getAllByLabelText("Activity Artwork Image")).toHaveLength(4)
  })

  it("should track event when an item is tapped", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Notification: () => notification,
    })
    await flushPromiseQueue()

    fireEvent.press(getByText("Notification Title"))

    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "action": "clickedActivityPanelNotificationItem",
          "notification_type": "ARTWORK_PUBLISHED",
        },
      ]
    `)
  })

  it("should pass predefined props when", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Notification: () => notification,
    })
    await flushPromiseQueue()

    fireEvent.press(getByText("Notification Title"))

    await flushPromiseQueue()

    expect(navigate).toHaveBeenCalledWith(targetUrl, {
      passProps: {
        predefinedFilters: [
          {
            displayText: "Recently Added",
            paramName: "sort",
            paramValue: "-published_at",
          },
        ],
      },
    })
  })

  it("should decrease the unread notifications counter by 1 when the notification is marked as read", async () => {
    __globalStoreTestUtils__?.injectState({
      bottomTabs: {
        sessionState: {
          unreadCounts: {
            notifications: 2,
          },
        },
      },
    })

    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Notification: () => ({
        ...notification,
        isUnread: true,
      }),
    })
    await flushPromiseQueue()

    fireEvent.press(getByText("Notification Title"))

    // resolving the mark as read mutation
    resolveMostRecentRelayOperation(mockEnvironment)
    await flushPromiseQueue()

    const globalStoreState = __globalStoreTestUtils__?.getCurrentState()
    expect(globalStoreState?.bottomTabs.sessionState.unreadCounts.notifications).toBe(1)
  })

  it("should pass search criteria id prop", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Notification: () => ({
        ...notification,
        targetHref: alertTargetUrl,
      }),
    })
    await flushPromiseQueue()

    fireEvent.press(getByText("Notification Title"))

    await flushPromiseQueue()

    expect(navigate).toHaveBeenCalledWith(alertTargetUrl, {
      passProps: {
        searchCriteriaID: "searchCriteriaId",
        predefinedFilters: [
          {
            displayText: "Recently Added",
            paramName: "sort",
            paramValue: "-published_at",
          },
        ],
      },
    })
  })

  it("should NOT call `mark as read` mutation if the notification has already been read", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Notification: () => notification,
    })
    await flushPromiseQueue()

    fireEvent.press(getByText("Notification Title"))

    await flushPromiseQueue()

    expect(() => mockEnvironment.mock.getMostRecentOperation()).toThrowError(
      "There are no pending operations in the list"
    )
  })

  describe("Unread notification indicator", () => {
    it("should NOT be rendered by default", async () => {
      const { queryByLabelText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Notification: () => notification,
      })
      await flushPromiseQueue()

      const indicator = queryByLabelText("Unread notification indicator")
      expect(indicator).toBeNull()
    })

    it("should be rendered when notification is unread", async () => {
      const { getByLabelText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Notification: () => ({
          ...notification,
          isUnread: true,
        }),
      })
      await flushPromiseQueue()

      const indicator = getByLabelText("Unread notification indicator")
      expect(indicator).toBeTruthy()
    })

    it("should be removed after the activity item is pressed", async () => {
      const { getByText, queryByLabelText } = renderWithHookWrappersTL(
        <TestRenderer />,
        mockEnvironment
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Notification: () => ({
          ...notification,
          isUnread: true,
        }),
      })
      await flushPromiseQueue()

      expect(queryByLabelText("Unread notification indicator")).toBeTruthy()
      fireEvent.press(getByText("Notification Title"))

      // resolving the mark as read mutation
      resolveMostRecentRelayOperation(mockEnvironment)
      await flushPromiseQueue()

      expect(queryByLabelText("Unread notification indicator")).toBeFalsy()
    })
  })

  describe("Notification type", () => {
    it("should NOT be rendered by default", async () => {
      const { queryByLabelText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Notification: () => notification,
      })
      await flushPromiseQueue()

      const label = queryByLabelText(/Notification type: .+/i)
      expect(label).toBeNull()
    })

    it("should render 'Alert'", async () => {
      const { getByLabelText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Notification: () => ({
          ...notification,
          notificationType: "ARTWORK_ALERT",
        }),
      })
      await flushPromiseQueue()

      const label = getByLabelText("Notification type: Alert")
      expect(label).toBeTruthy()
    })
  })

  describe("remaining artworks count", () => {
    it("should NOT be rendered if there are less or equal to 4", async () => {
      const { queryByLabelText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Notification: () => ({
          ...notification,
          objectsCount: 4,
        }),
      })
      await flushPromiseQueue()

      expect(queryByLabelText("Remaining artworks count")).toBeFalsy()
    })

    it("should NOT be rendered if notification is not artwork-based", async () => {
      const { queryByLabelText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Notification: () => ({
          ...notification,
          notificationType: "PARTNER_SHOW_OPENED",
          objectsCount: 5,
        }),
      })
      await flushPromiseQueue()

      expect(queryByLabelText("Remaining artworks count")).toBeFalsy()
    })

    it("should be rendered if there are more than 4", async () => {
      const { getByText, getByLabelText } = renderWithHookWrappersTL(
        <TestRenderer />,
        mockEnvironment
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Notification: () => ({
          ...notification,
          objectsCount: 5,
        }),
      })
      await flushPromiseQueue()

      expect(getByLabelText("Remaining artworks count")).toBeTruthy()
      expect(getByText("+ 1")).toBeTruthy()
    })
  })
})

const artworks = [
  {
    node: {
      internalID: "artwork-id-one",
      title: "artwork one",
      image: {
        thumb: {
          src: "artwork-image-one",
          srcSet: "artwork-image-one",
        },
      },
    },
  },
  {
    node: {
      internalID: "artwork-id-two",
      title: "artwork two",
      image: {
        thumb: {
          src: "artwork-image-two",
          srcSet: "artwork-image-two",
        },
      },
    },
  },
  {
    node: {
      internalID: "artwork-id-three",
      title: "artwork three",
      image: {
        thumb: {
          src: "artwork-image-three",
          srcSet: "artwork-image-three",
        },
      },
    },
  },
  {
    node: {
      internalID: "artwork-id-four",
      title: "artwork four",
      image: {
        thumb: {
          src: "artwork-image-four",
          srcSet: "artwork-image-four",
        },
      },
    },
  },
]

const notification = {
  title: "Notification Title",
  message: "Notification Message",
  publishedAt: "2 days ago",
  isUnread: false,
  notificationType: "ARTWORK_PUBLISHED",
  targetHref: targetUrl,
  objectsCount: 4,
  artworksConnection: {
    edges: artworks,
  },
}
