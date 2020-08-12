import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { RelayEnvironmentProvider } from "relay-hooks"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ViewingRoomsListItem } from "../Components/ViewingRoomsListItem"
import { ViewingRoomsListQueryRenderer } from "../ViewingRoomsList"

jest.unmock("react-relay")

describe("ViewingRoomsList", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <RelayEnvironmentProvider environment={mockEnvironment}>
      <ViewingRoomsListQueryRenderer />
    </RelayEnvironmentProvider>
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("renders viewing rooms", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironment.mock.resolveMostRecentOperation(operation =>
      MockPayloadGenerator.generate(operation, {
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
    )
    expect(tree.root.findAllByType(ViewingRoomsListItem).length).toBeGreaterThanOrEqual(2)
  })
})
