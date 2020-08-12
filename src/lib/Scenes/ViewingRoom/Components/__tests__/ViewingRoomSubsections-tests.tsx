import { Box } from "@artsy/palette"
import { ViewingRoomSubsectionsTestsQuery } from "__generated__/ViewingRoomSubsectionsTestsQuery.graphql"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ViewingRoomSubsectionsContainer } from "../ViewingRoomSubsections"

jest.unmock("react-relay")

describe("ViewingRoomSubsections", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<ViewingRoomSubsectionsTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query ViewingRoomSubsectionsTestsQuery {
          viewingRoom(id: "unused") {
            ...ViewingRoomSubsections_viewingRoom
          }
        }
      `}
      render={renderWithLoadProgress(ViewingRoomSubsectionsContainer)}
      variables={{}}
    />
  )
  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })
  it("renders a Box for each subsection", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation(operation => {
      const result = MockPayloadGenerator.generate(operation)
      return result
    })
    expect(tree.root.findAllByType(Box)).toHaveLength(1)
  })
})
