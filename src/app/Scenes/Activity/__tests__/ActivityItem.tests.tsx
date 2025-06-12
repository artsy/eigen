import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { ActivityItem_Test_Query } from "__generated__/ActivityItem_Test_Query.graphql"
import { ActivityItem_notification$key } from "__generated__/ActivityItem_notification.graphql"
import { ActivityItem } from "app/Scenes/Activity/ActivityItem"
import * as navigation from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

const targetUrl = "/artist/banksy/works-for-sale?sort=-published_at"

const TestRenderer = () => {
  const data = useLazyLoadQuery<ActivityItem_Test_Query>(
    graphql`
      query ActivityItem_Test_Query {
        notificationsConnection(first: 1) {
          edges {
            node {
              ...ActivityItem_notification
            }
          }
        }
      }
    `,
    {}
  )
  const items = extractNodes(data.notificationsConnection)

  return <ActivityItem notification={items[0] as unknown as ActivityItem_notification$key} />
}

describe("ActivityItem", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const navigate = jest.spyOn(navigation, "navigate")

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
    jest.clearAllMocks()
  })

  const { renderWithRelay } = setupTestWrapper({
    Component: () => (
      <Suspense fallback={null}>
        <TestRenderer />
      </Suspense>
    ),
  })

  it("should the basic info", async () => {
    renderWithRelay({ Notification: () => notificationWithFF })

    await screen.findByText("Notification Headline")
  })

  it("should render the formatted publication date", async () => {
    renderWithRelay({
      Notification: () => notification,
    })

    await screen.findByText("2 days ago")
  })

  it("should render artwork images", async () => {
    renderWithRelay({
      Notification: () => notification,
    })

    await waitFor(() => expect(screen.getAllByLabelText("Activity Artwork Image")).toHaveLength(4))
  })

  it("should track event when an item is tapped", async () => {
    renderWithRelay({
      Notification: () => notificationWithFF,
    })

    fireEvent.press(await screen.findByText("Notification Headline"))

    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "action": "clickedActivityPanelNotificationItem",
          "notification_type": "ARTWORK_PUBLISHED",
        },
      ]
    `)
  })

  it("navigates to notification screen when supported", async () => {
    renderWithRelay({
      Notification: () => notificationWithFF,
    })

    fireEvent.press(await screen.findByText("Notification Headline"))

    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith('/notification/<mock-value-for-field-"internalID">')
    )
  })

  it("does not navigate given a notificationItem of type 'PartnerOfferCreatedNotificationItem'", async () => {
    renderWithRelay({
      Notification: () => ({
        ...notificationWithFF,
        item: {
          item: notificationWithFF.item,
          __typename: "CollectorProfileUpdatePromptNotificationItem",
        },
      }),
    })

    fireEvent.press(await screen.findByText("Tell us a little bit more about you."))

    expect(navigate).not.toHaveBeenCalled()
  })

  it("should NOT call `mark as read` mutation if the notification has already been read", async () => {
    renderWithRelay({
      Notification: () => notificationWithFF,
    })

    fireEvent.press(await screen.findByText("Notification Headline"))

    await waitFor(() =>
      expect(() => mockEnvironment.mock.getMostRecentOperation()).toThrowError(
        "There are no pending operations in the list"
      )
    )
  })

  describe("Unread notification indicator", () => {
    it("should NOT be rendered by default", async () => {
      renderWithRelay({
        Notification: () => notificationWithFF,
      })

      expect(screen.queryByLabelText("Unread notification indicator")).not.toBeOnTheScreen()
    })

    it("should be rendered when notification is unread", async () => {
      renderWithRelay({
        Notification: () => ({
          ...notification,
          isUnread: true,
        }),
      })

      await screen.findByLabelText("Unread notification indicator")
    })

    it("should be removed after the activity item is pressed", async () => {
      renderWithRelay({
        Notification: () => ({
          ...notificationWithFF,
          isUnread: true,
        }),
      })

      await screen.findByLabelText("Unread notification indicator")
      fireEvent.press(screen.getByText("Notification Headline"))
      expect(screen.queryByLabelText("Unread notification indicator")).toBeFalsy()
    })
  })

  describe("Notification type", () => {
    it("should render 'Alert'", async () => {
      renderWithRelay({
        Notification: () => ({
          ...notification,
          notificationType: "ARTWORK_ALERT",
        }),
      })

      await screen.findByLabelText("Notification type: Alert")
    })

    it("should render 'Offer'", async () => {
      renderWithRelay({
        Notification: () => ({
          ...notificationWithFF,
          notificationType: "PARTNER_OFFER_CREATED",
        }),
      })

      await screen.findByLabelText("Notification type: Offer")
      expect(screen.getByText("Limited-Time Offer")).toBeOnTheScreen()
    })
  })

  describe("remaining artworks count", () => {
    it("should NOT be rendered if there are less or equal to 4", async () => {
      renderWithRelay({
        Notification: () => ({
          ...notification,
          objectsCount: 4,
        }),
      })

      expect(screen.queryByLabelText("Remaining artworks count")).not.toBeOnTheScreen()
    })

    it("should NOT be rendered if notification is not artwork-based", async () => {
      renderWithRelay({
        Notification: () => ({
          ...notification,
          notificationType: "PARTNER_SHOW_OPENED",
          objectsCount: 5,
        }),
      })

      expect(screen.queryByLabelText("Remaining artworks count")).not.toBeOnTheScreen()
    })

    it("should be rendered if there are more than 4", async () => {
      renderWithRelay({
        Notification: () => ({
          ...notification,
          objectsCount: 5,
        }),
      })

      await screen.findByLabelText("Remaining artworks count")
      expect(screen.getByText("+ 1")).toBeOnTheScreen()
    })
  })
})

const notification = {
  title: "Notification Title",
  message: "Notification Message",
  publishedAt: "2 days ago",
  isUnread: false,
  notificationType: "ARTWORK_PUBLISHED",
  targetHref: targetUrl,
  objectsCount: 4,
  previewImages: [
    {
      url: "artwork-image-one",
    },
    {
      url: "artwork-image-two",
    },
    {
      url: "artwork-image-three",
    },
    {
      url: "artwork-image-four",
    },
  ],
  item: { __typename: "PartnerOfferCreatedNotificationItem" },
}

const notificationWithFF = {
  headline: "Notification Headline",
  publishedAt: "2 days ago",
  isUnread: false,
  notificationType: "ARTWORK_PUBLISHED",
  targetHref: targetUrl,
  objectsCount: 4,
  previewImages: [
    {
      url: "artwork-image-one",
    },
    {
      url: "artwork-image-two",
    },
    {
      url: "artwork-image-three",
    },
    {
      url: "artwork-image-four",
    },
  ],
  item: { __typename: "PartnerOfferCreatedNotificationItem" },
}
