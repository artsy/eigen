import { ViewingRoomViewWorksButtonTestsQuery } from "__generated__/ViewingRoomViewWorksButtonTestsQuery.graphql"
import { navigate } from "app/navigation/navigate"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { TouchableHighlight } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import { tracks, ViewingRoomViewWorksButton } from "./ViewingRoomViewWorksButton"

describe("ViewingRoomViewWorksButton", () => {
  const TestRenderer = () => (
    <QueryRenderer<ViewingRoomViewWorksButtonTestsQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query ViewingRoomViewWorksButtonTestsQuery {
          viewingRoom(id: "unused") {
            ...ViewingRoomViewWorksButton_viewingRoom
          }
        }
      `}
      render={renderWithLoadProgress(ViewingRoomViewWorksButton)}
      variables={{}}
    />
  )

  it("navigates to artworks page + calls tracking on button press", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation({
      ViewingRoom: () => ({
        artworksForCount: { totalCount: 42 },
        slug: "gallery-name-viewing-room-name",
        internalID: "2955ab33-c205-44ea-93d2-514cd7ee2bcd",
      }),
    })

    tree.root.findByType(TouchableHighlight).props.onPress()

    expect(navigate).toHaveBeenCalledWith("/viewing-room/gallery-name-viewing-room-name/artworks")

    expect(useTracking().trackEvent).toHaveBeenCalledWith(
      tracks.tappedViewWorksButton(
        "2955ab33-c205-44ea-93d2-514cd7ee2bcd",
        "gallery-name-viewing-room-name"
      )
    )
  })
})
