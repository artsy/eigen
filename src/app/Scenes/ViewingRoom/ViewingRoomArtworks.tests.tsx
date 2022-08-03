import { ViewingRoomArtworksTestsQuery } from "__generated__/ViewingRoomArtworksTestsQuery.graphql"
import { navigate } from "app/navigation/navigate"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { extractText } from "app/tests/extractText"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import {
  mockEdges,
  resolveMostRecentRelayOperation,
} from "app/tests/resolveMostRecentRelayOperation"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { Touchable } from "palette"
import { FlatList, TouchableHighlight } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import { tracks, ViewingRoomArtworksContainer } from "./ViewingRoomArtworks"

describe("ViewingRoom", () => {
  const TestRenderer = () => (
    <QueryRenderer<ViewingRoomArtworksTestsQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query ViewingRoomArtworksTestsQuery {
          viewingRoom(id: "unused") {
            ...ViewingRoomArtworks_viewingRoom
          }
        }
      `}
      render={renderWithLoadProgress(ViewingRoomArtworksContainer)}
      variables={{}}
    />
  )

  it("renders a flatlist with one artwork", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation({
      ViewingRoom: () => ({ artworksConnection: { edges: mockEdges(1) } }),
    })

    expect(tree.root.findAllByType(FlatList)).toHaveLength(1)
    expect(tree.root.findAllByType(TouchableHighlight)).toHaveLength(1)
  })

  it("renders additional information if it exists", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation({
      ViewingRoom: () => ({
        artworksConnection: {
          edges: mockEdges(1),
        },
      }),
    })

    expect(
      extractText(tree.root.findByProps({ testID: "artwork-additional-information" }))
    ).toEqual("additionalInformation-1")
  })

  it("navigates to artwork screen + calls tracking on press", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation({
      ViewingRoom: () => ({
        artworksConnection: { edges: mockEdges(1) },
      }),
    })

    tree.root.findByType(Touchable).props.onPress()

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
