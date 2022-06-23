import { ViewingRoomSubsectionsTestsQuery } from "__generated__/ViewingRoomSubsectionsTestsQuery.graphql"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { Box } from "palette"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { ViewingRoomSubsectionsContainer } from "./ViewingRoomSubsections"

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
  beforeEach(() => (mockEnvironment = createMockEnvironment()))

  it("renders a Box for each subsection", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation(mockEnvironment)

    expect(
      tree.root.findAllByType(Box).filter((box) => box.props.testID === "subsection")
    ).toHaveLength(1)
  })
})
