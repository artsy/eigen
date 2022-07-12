import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { RelayEnvironmentProvider } from "react-relay"
import { ViewingRoomsListItem } from "./Components/ViewingRoomsListItem"
import { ViewingRoomsListScreen } from "./ViewingRoomsList"

describe("ViewingRoomsList", () => {
  const TestRenderer = () => (
    <RelayEnvironmentProvider environment={getRelayEnvironment()}>
      <ViewingRoomsListScreen />
    </RelayEnvironmentProvider>
  )

  it("renders viewing rooms", async () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)

    resolveMostRecentRelayOperation({
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

    await flushPromiseQueue()

    expect(tree.root.findAllByType(ViewingRoomsListItem).length).toBeGreaterThanOrEqual(2)
  })
})
