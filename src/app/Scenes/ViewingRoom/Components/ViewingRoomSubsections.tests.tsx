import { ViewingRoomSubsectionsTestsQuery } from "__generated__/ViewingRoomSubsectionsTestsQuery.graphql"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { Box } from "palette"
import { graphql, QueryRenderer } from "react-relay"
import { ViewingRoomSubsectionsContainer } from "./ViewingRoomSubsections"

describe("ViewingRoomSubsections", () => {
  const TestRenderer = () => (
    <QueryRenderer<ViewingRoomSubsectionsTestsQuery>
      environment={getRelayEnvironment()}
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

  it("renders a Box for each subsection", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation()

    expect(
      tree.root.findAllByType(Box).filter((box) => box.props.testID === "subsection")
    ).toHaveLength(1)
  })
})
