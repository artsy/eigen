import { screen, waitFor } from "@testing-library/react-native"
import { ViewingRoomsListScreen } from "app/Scenes/ViewingRoom/ViewingRoomsList"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { RelayEnvironmentProvider } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

describe("ViewingRoomsList", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("renders viewing rooms", async () => {
    await renderWithWrappers(
      <RelayEnvironmentProvider environment={mockEnvironment}>
        <ViewingRoomsListScreen />
      </RelayEnvironmentProvider>
    )

    expect(screen.getByTestId("viewing-rooms-list-placeholder")).toBeOnTheScreen()

    await resolveMostRecentRelayOperation(mockEnvironment, {
      Query: () => ({
        viewingRoomsConnection: {
          edges: [
            { node: { title: "one", status: "live" } },
            { node: { title: "two", status: "live" } },
            { node: { title: "three", status: "closed" } },
            { node: { title: "four", status: "sheduled" } },
          ],
        },
      }),
    })
    await waitFor(() =>
      expect(screen.queryByTestId("viewing-rooms-list-placeholder")).not.toBeOnTheScreen()
    )

    // ViewingRoomsListItem renders each viewing room's title
    expect(screen.getAllByText(/^(one|two|three|four)$/).length).toBeGreaterThanOrEqual(2)
  })
})
