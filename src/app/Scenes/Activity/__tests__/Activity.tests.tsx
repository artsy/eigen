import { act, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react-native"
import { ActivityScreen } from "app/Scenes/Activity/ActivityScreen"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("ActivityScreen", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => <ActivityScreen />,
  })

  it("renders items", async () => {
    const { mockResolveLastOperation: resolveHeaderLastOperation } = renderWithRelay({
      NotificationConnection: () => notifications,
    })

    act(() => {
      resolveHeaderLastOperation({})
    })

    await waitForElementToBeRemoved(() => screen.queryByTestId("activity-content-placeholder"), {
      timeout: 15000,
    })

    expect(screen.getByText("Notification One")).toBeOnTheScreen()
    expect(screen.getByText("Notification Two")).toBeOnTheScreen()
  })

  describe("notification type filter pills", () => {
    it("renders all filter pills", async () => {
      const { mockResolveLastOperation: resolveHeaderLastOperation } = renderWithRelay({
        NotificationConnection: () => {
          notifications
        },
      })

      act(() => {
        resolveHeaderLastOperation({
          NotificationConnection: () => ({ totalCount: 1 }),
        })
      })

      await waitForElementToBeRemoved(() => screen.queryByTestId("activity-content-placeholder"))

      await screen.findByText("All")
      expect(screen.getByText("Offers")).toBeOnTheScreen()
      expect(screen.getByText("Alerts")).toBeOnTheScreen()
      expect(screen.getByText("Follows")).toBeOnTheScreen()
    })

    it("does not render 'Offers' filter pill when there are no offers available", async () => {
      const { mockResolveLastOperation: resolveHeaderLastOperation } = renderWithRelay({
        NotificationConnection: () => notifications,
      })

      act(() => {
        resolveHeaderLastOperation({
          NotificationConnection: () => ({ totalCount: 0 }),
        })
      })

      await waitForElementToBeRemoved(() => screen.queryByTestId("activity-content-placeholder"))

      await waitFor(() => expect(screen.queryByText("Offers")).not.toBeOnTheScreen())

      expect(screen.getByText("All")).toBeOnTheScreen()
      expect(screen.getByText("Alerts")).toBeOnTheScreen()
      expect(screen.getByText("Follows")).toBeOnTheScreen()
    })
  })

  it("renders empty states", async () => {
    renderWithRelay({
      NotificationConnection: () => ({
        edges: [],
      }),
    })

    await screen.findByLabelText("Activities are empty")
  })

  it("hides notifications with 0 artworks", async () => {
    renderWithRelay({
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

    await waitForElementToBeRemoved(() => screen.queryByTestId("activity-content-placeholder"))

    await screen.findByText("Notification One")
    expect(screen.getByText("Notification Two")).toBeOnTheScreen()
    expect(screen.queryByText("Notification Three")).not.toBeOnTheScreen()
  })
})

const notifications = {
  edges: [
    {
      node: {
        headline: "Notification One",
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
        headline: "Notification Two",
        notificationType: "ARTWORK_ALERT",
        artworks: {
          totalCount: 3,
        },
      },
    },
  ],
}
