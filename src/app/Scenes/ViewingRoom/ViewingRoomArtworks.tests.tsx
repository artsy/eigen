import { screen } from "@testing-library/react-native"
import { ViewingRoomArtworksTestsQuery } from "__generated__/ViewingRoomArtworksTestsQuery.graphql"
import { navigate } from "app/system/navigation/navigate"
import { extractText } from "app/utils/tests/extractText"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Touchable } from "@artsy/palette-mobile"
import { FlatList, TouchableHighlight } from "react-native"
import { graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { tracks, ViewingRoomArtworksContainer } from "./ViewingRoomArtworks"

describe("ViewingRoom", () => {
  const { renderWithRelay } = setupTestWrapper<ViewingRoomArtworksTestsQuery>({
    Component: (props) => <ViewingRoomArtworksContainer viewingRoom={props.viewingRoom!} />,
    query: graphql`
      query ViewingRoomArtworksTestsQuery {
        artwork(id: "selected-artwork") {
          ...ViewingRoomArtwork_selectedArtwork
        }
        viewingRoom(id: "unused") {
          ...ViewingRoomArtworks_viewingRoom
        }
      }
    `,
  })

  it("renders a flatlist with one artwork", () => {
    renderWithRelay()

    expect(screen.UNSAFE_getAllByType(FlatList)).toHaveLength(1)
    expect(screen.UNSAFE_getAllByType(TouchableHighlight)).toHaveLength(1)
  })

  it("renders additional information if it exists", () => {
    renderWithRelay({
      Artwork: () => ({
        additionalInformation: "additionalInformation-1",
      }),
    })

    expect(
      extractText(screen.UNSAFE_getByProps({ testID: "artwork-additional-information" }))
    ).toEqual("additionalInformation-1")
  })

  it("navigates to artwork screen + calls tracking on press", () => {
    renderWithRelay({
      ViewingRoom: () => ({
        internalID: "viewing-room-internalID-1",
        slug: "slug-1",
      }),
      Artwork: () => ({
        internalID: "artwork-internalID-1",
        slug: "artwork-slug-1",
      }),
    })

    screen.UNSAFE_getByType(Touchable).props.onPress()

    expect(navigate).toHaveBeenCalledWith("/viewing-room/slug-1/artwork-slug-1")

    expect(useTracking().trackEvent).toHaveBeenCalledWith({
      ...tracks.context("viewing-room-internalID-1", "slug-1"),
      ...tracks.tappedArtworkGroup(
        "viewing-room-internalID-1",
        "slug-1",
        "artwork-internalID-1",
        "artwork-slug-1"
      ),
    })
  })
})
