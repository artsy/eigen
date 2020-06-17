import { ViewingRoomsListTestsQuery } from "__generated__/ViewingRoomsListTestsQuery.graphql"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import ReactTestRenderer from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ViewingRoomsListItemFragmentContainer } from "../Components/ViewingRoomsListItem"
import { ViewingRoomsListFragmentContainer } from "../ViewingRoomsList"

jest.unmock("react-relay")

describe("ViewingRoomsList", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<ViewingRoomsListTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query ViewingRoomsListTestsQuery {
          viewingRooms {
            ...ViewingRoomsList_viewingRooms
          }
        }
      `}
      render={renderWithLoadProgress(ViewingRoomsListFragmentContainer)}
      variables={{}}
    />
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
                status: "draft",
              },
            },
            {
              node: {
                status: "draft",
              },
            },
            {
              node: {
                status: "live",
              },
            },
            {
              node: {
                status: "closed",
              },
            },
            {
              node: {
                status: "scheduled",
              },
            },
          ],
        }),
      })
      return result
    })
    expect(tree.root.findAllByType(ViewingRoomsListItemFragmentContainer)).toHaveLength(2)
  })
})
