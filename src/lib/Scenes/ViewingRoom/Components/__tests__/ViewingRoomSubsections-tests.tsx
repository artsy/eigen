import { Box, Theme } from "@artsy/palette"
import { ViewingRoomSubsectionsTestsQuery } from "__generated__/ViewingRoomSubsectionsTestsQuery.graphql"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import ReactTestRenderer from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ViewingRoomSubsectionsContainer } from "../ViewingRoomSubsections"

jest.unmock("react-relay")

describe("ViewingRoomSubsections", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <Theme>
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
    </Theme>
  )
  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })
  it("renders a Box for each subsection", () => {
    const tree = ReactTestRenderer.create(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation(operation => {
      const result = MockPayloadGenerator.generate(operation)
      return result
    })
    expect(tree.root.findAllByType(Box)).toHaveLength(1)
  })
})
