import { act, screen, waitFor } from "@testing-library/react-native"
import { ActivityScreen } from "app/Scenes/Activity/ActivityScreen"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"

describe("ActivityScreen", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => <ActivityScreen />,
  })

  it("renders items", async () => {
    const { env } = await renderWithRelay({
      NotificationConnection: () => notifications,
    })

    await resolveHeaderQuery(env, {})

    await waitFor(
      () => expect(screen.queryByTestId("activity-content-placeholder")).not.toBeOnTheScreen(),
      { timeout: 15000 }
    )

    expect(screen.getByText("Notification One")).toBeOnTheScreen()
    expect(screen.getByText("Notification Two")).toBeOnTheScreen()
  })

  describe("notification type filter pills", () => {
    it("renders all filter pills", async () => {
      const { env } = await renderWithRelay({
        NotificationConnection: () => {
          notifications
        },
      })

      await resolveHeaderQuery(env, {
        NotificationConnection: () => ({ totalCount: 1 }),
      })

      await waitFor(() =>
        expect(screen.queryByTestId("activity-content-placeholder")).not.toBeOnTheScreen()
      )

      await screen.findByText("All")
      expect(screen.getByText("Offers")).toBeOnTheScreen()
      expect(screen.getByText("Alerts")).toBeOnTheScreen()
      expect(screen.getByText("Follows")).toBeOnTheScreen()
    })

    it("does not render 'Offers' filter pill when there are no offers available", async () => {
      const { env } = await renderWithRelay({
        NotificationConnection: () => notifications,
      })

      await resolveHeaderQuery(env, {
        NotificationConnection: () => ({ totalCount: 0 }),
      })

      await waitFor(() =>
        expect(screen.queryByTestId("activity-content-placeholder")).not.toBeOnTheScreen()
      )

      await waitFor(() => expect(screen.queryByText("Offers")).not.toBeOnTheScreen())

      expect(screen.getByText("All")).toBeOnTheScreen()
      expect(screen.getByText("Alerts")).toBeOnTheScreen()
      expect(screen.getByText("Follows")).toBeOnTheScreen()
    })
  })

  it("renders empty states", async () => {
    await renderWithRelay({
      NotificationConnection: () => ({
        edges: [],
      }),
    })

    await screen.findByLabelText("Activities are empty")
  })

  it("hides notifications with 0 artworks", async () => {
    await renderWithRelay({
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

    await waitFor(() =>
      expect(screen.queryByTestId("activity-content-placeholder")).not.toBeOnTheScreen()
    )

    await screen.findByText("Notification One")
    expect(screen.getByText("Notification Two")).toBeOnTheScreen()
    expect(screen.queryByText("Notification Three")).not.toBeOnTheScreen()
  })
})

// The header query is not the most recent operation: the screen also marks notifications as seen.
const resolveHeaderQuery = async (
  env: ReturnType<typeof createMockEnvironment>,
  mockResolvers: MockResolvers
) => {
  const operation = env.mock
    .getAllOperations()
    .find((op) => op.request.node.operation.name === "ActivityHeaderQuery")

  expect(operation).toBeDefined()

  await act(() => {
    env.mock.resolve(operation!, MockPayloadGenerator.generate(operation!, mockResolvers))
  })
}

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
