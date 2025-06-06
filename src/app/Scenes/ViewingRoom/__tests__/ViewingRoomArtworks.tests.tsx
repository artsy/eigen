import { fireEvent, screen } from "@testing-library/react-native"
import { ViewingRoomArtworksTestsQuery } from "__generated__/ViewingRoomArtworksTestsQuery.graphql"
import { tracks, ViewingRoomArtworksContainer } from "app/Scenes/ViewingRoom/ViewingRoomArtworks"
import { RouterLink } from "app/system/navigation/RouterLink"
import { navigate } from "app/system/navigation/navigate"
import { extractText } from "app/utils/tests/extractText"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { FlatList } from "react-native"
import { graphql } from "react-relay"
import { useTracking } from "react-tracking"

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
    expect(screen.UNSAFE_getAllByType(RouterLink)).toHaveLength(1)
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
        title: "Viewing Room 1",
      }),
      Artwork: () => ({
        internalID: "artwork-internalID-1",
        slug: "artwork-slug-1",
        title: "Artwork 1",
      }),
    })

    fireEvent.press(screen.getByText("Artwork 1"))

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
