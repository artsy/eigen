import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import ReactTestRenderer from "react-test-renderer"
import { RelayEnvironmentProvider } from "relay-hooks"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ViewingRoomsListItem } from "../Components/ViewingRoomsListItem"
import { ViewingRoomsList, ViewingRoomsListQueryRenderer } from "../ViewingRoomsList"

jest.unmock("react-relay")

describe("ViewingRoomsList", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <RelayEnvironmentProvider environment={defaultEnvironment}>
      <ViewingRoomsListQueryRenderer />
    </RelayEnvironmentProvider>
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("renders scheduled and live viewing rooms", () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation(operation => {
      const result = MockPayloadGenerator.generate(operation, {
        ViewingRoomConnection: () => ({
          edges: [
            {
              node: {
                status: "live",
                title: "wow",
                slug: "wow",
                internalID: "wow12",
              },
            },
          ],
        }),
      })
      return result
    })
    // expect(tree.root.findAllByType(ViewingRoomsListItem)).toHaveLength(1)
  })
})
