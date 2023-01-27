import { ViewingRoomArtworksTestsQuery } from "__generated__/ViewingRoomArtworksTestsQuery.graphql"
import { navigate } from "app/system/navigation/navigate"
import { extractText } from "app/utils/tests/extractText"
import { mockEdges } from "app/utils/tests/resolveMostRecentRelayOperation"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Touchable } from "palette"
import { FlatList, TouchableHighlight } from "react-native"
import { graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { tracks, ViewingRoomArtworksContainer } from "./ViewingRoomArtworks"

describe("ViewingRoom", () => {
  const { renderWithRelay } = setupTestWrapper<ViewingRoomArtworksTestsQuery>({
    Component: (props) => {
      if (props?.viewingRoom) {
        return <ViewingRoomArtworksContainer viewingRoom={props.viewingRoom} />
      }
      return null
    },
    query: graphql`
      query ViewingRoomArtworksTestsQuery {
        viewingRoom(id: "unused") {
          ...ViewingRoomArtworks_viewingRoom
        }
      }
    `,
  })

  it("renders a flatlist with one artwork", () => {
    const tree = renderWithRelay({
      ViewingRoom: () => ({ artworksConnection: { edges: mockEdges(1) } }),
    })

    expect(tree.UNSAFE_getAllByType(FlatList)).toHaveLength(1)
    expect(tree.UNSAFE_getAllByType(TouchableHighlight)).toHaveLength(1)
  })

  it("renders additional information if it exists", () => {
    const tree = renderWithRelay({
      ViewingRoom: () => ({
        artworksConnection: {
          edges: mockEdges(1),
        },
      }),
    })

    expect(
      extractText(tree.UNSAFE_getByProps({ testID: "artwork-additional-information" }))
    ).toEqual("additionalInformation-1")
  })

  it("navigates to artwork screen + calls tracking on press", () => {
    const tree = renderWithRelay({
      ViewingRoom: () => ({
        artworksConnection: { edges: mockEdges(1) },
      }),
    })

    tree.UNSAFE_getByType(Touchable).props.onPress()

    expect(navigate).toHaveBeenCalledWith("/viewing-room/slug-1/artworksConnection.slug-1")

    expect(useTracking().trackEvent).toHaveBeenCalledWith({
      ...tracks.context("internalID-1", "slug-1"),
      ...tracks.tappedArtworkGroup(
        "internalID-1",
        "slug-1",
        "artworksConnection.internalID-1",
        "artworksConnection.slug-1"
      ),
    })
  })
})
