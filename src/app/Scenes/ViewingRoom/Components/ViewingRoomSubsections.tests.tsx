import { ViewingRoomSubsectionsTestsQuery } from "__generated__/ViewingRoomSubsectionsTestsQuery.graphql"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
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
    mockEnvironmentPayload(mockEnvironment)

    expect(
      tree.root.findAllByType(Box).filter((box) => box.props.testID === "subsection")
    ).toHaveLength(1)
  })
})
