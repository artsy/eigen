import { ViewingRoomSubsectionsTestsQuery } from "__generated__/ViewingRoomSubsectionsTestsQuery.graphql"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { Box } from "palette"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { ViewingRoomSubsectionsContainer } from "./ViewingRoomSubsections"

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
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation(mockEnvironment)

    expect(
      tree.root.findAllByType(Box).filter((box) => box.props.testID === "subsection")
    ).toHaveLength(1)
  })
})
