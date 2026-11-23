import { screen, waitForElementToBeRemoved } from "@testing-library/react-native"
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
    renderWithWrappers(
      <RelayEnvironmentProvider environment={mockEnvironment}>
        <ViewingRoomsListScreen />
      </RelayEnvironmentProvider>
    )

    resolveMostRecentRelayOperation(mockEnvironment, {
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
    await waitForElementToBeRemoved(() => screen.queryByTestId("viewing-rooms-list-placeholder"))

    // ViewingRoomsListItem renders each viewing room's title
    expect(screen.getAllByText(/^(one|two|three|four)$/).length).toBeGreaterThanOrEqual(2)
  })
})
