import { act, fireEvent, screen } from "@testing-library/react-native"
import { ShowViewingRoomTestsQuery } from "__generated__/ShowViewingRoomTestsQuery.graphql"
import { ShowViewingRoomFragmentContainer } from "app/Scenes/Show/Components/ShowViewingRoom"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

describe("ShowViewingRoom", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<ShowViewingRoomTestsQuery>
      environment={env}
      query={graphql`
        query ShowViewingRoomTestsQuery($showID: String!) @relay_test_operation {
          show(id: $showID) {
            ...ShowViewingRoom_show
          }
        }
      `}
      variables={{ showID: "the-big-show" }}
      render={({ props, error }) => {
        if (props?.show) {
          return <ShowViewingRoomFragmentContainer show={props.show} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  const getWrapper = async (mockResolvers = {}) => {
    await renderWithWrappers(<TestRenderer />)
    await act(() => {
      env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, mockResolvers)
      )
    })
  }

  it("renders the viewing room card", async () => {
    await getWrapper({
      Partner: () => ({ name: "Example Partner" }),
      ViewingRoom: () => ({ title: "Example Viewing Room" }),
    })

    expect(screen.getByText(/Example Partner/)).toBeOnTheScreen()
    expect(screen.getByText(/Example Viewing Room/)).toBeOnTheScreen()
  })

  it("tracks taps", async () => {
    await getWrapper({
      Show: () => ({ internalID: "example-show-id", slug: "example-slug" }),
      ViewingRoom: () => ({
        internalID: "example-viewing-room-id",
        slug: "example-viewing-room-slug",
        title: "Example Viewing Room",
      }),
    })

    await fireEvent.press(screen.getByText("Example Viewing Room"))

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedViewingRoomCard",
      context_module: "associatedViewingRoom",
      context_screen_owner_id: "example-show-id",
      context_screen_owner_slug: "example-slug",
      context_screen_owner_type: "show",
      destination_screen_owner_id: "example-viewing-room-id",
      destination_screen_owner_slug: "example-viewing-room-slug",
      destination_screen_owner_type: "viewingRoom",
      type: "thumbnail",
    })
  })
})
