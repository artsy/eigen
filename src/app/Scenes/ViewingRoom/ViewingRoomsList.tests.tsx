import { screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { RelayEnvironmentProvider } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { ViewingRoomsListItem } from "./Components/ViewingRoomsListItem"
import { ViewingRoomsListScreen } from "./ViewingRoomsList"

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
        viewingRooms: {
          edges: [
            { node: { title: "one", status: "live" } },
            { node: { title: "two", status: "live" } },
            { node: { title: "three", status: "closed" } },
            { node: { title: "four", status: "sheduled" } },
          ],
        },
      }),
    })
    await waitForElementToBeRemoved(() => screen.getByTestId("viewing-rooms-list-placeholder"))

    expect(screen.UNSAFE_queryAllByType(ViewingRoomsListItem).length).toBeGreaterThanOrEqual(2)
  })
})
