import { screen } from "@testing-library/react-native"
import { ViewingRoomSubsectionsTestsQuery } from "__generated__/ViewingRoomSubsectionsTestsQuery.graphql"
import { ViewingRoomSubsectionsContainer } from "app/Scenes/ViewingRoom/Components/ViewingRoomSubsections"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

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

  it("renders a Box for each subsection", async () => {
    await renderWithWrappers(<TestRenderer />)
    await resolveMostRecentRelayOperation(mockEnvironment)

    expect(screen.getAllByTestId("subsection")).toHaveLength(1)
  })
})
