import React from "react"
import ReactTestRenderer from "react-test-renderer"
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
    const tree = ReactTestRenderer.create(<TestRenderer />)

    mockEnvironment.mock.resolveMostRecentOperation(operation =>
      MockPayloadGenerator.generate(operation, {
        Query: () => ({
          viewingRooms: {
            edges: [{ node: { title: "one" } }, { node: { title: "two" } }],
          },
        }),
      })
    )
    expect(tree.root.findAllByType(ViewingRoomsListItem)).toHaveLength(2)
  })
})
