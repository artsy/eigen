import { fireEvent, screen } from "@testing-library/react-native"
import { ViewingRoomArtworksTestsQuery } from "__generated__/ViewingRoomArtworksTestsQuery.graphql"
import { tracks, ViewingRoomArtworksContainer } from "app/Scenes/ViewingRoom/ViewingRoomArtworks"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { useTracking } from "react-tracking"

describe("ViewingRoom", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableEnrichedMarkdown: false })
  })

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

  it("renders a flatlist with one artwork", async () => {
    await renderWithRelay({
      Artwork: () => ({ title: "Artwork 1" }),
    })

    expect(screen.getByText("Artworks")).toBeOnTheScreen()
    expect(screen.getAllByText("Artwork 1")).toHaveLength(1)
  })

  it("renders additional information if it exists", async () => {
    await renderWithRelay({
      Artwork: () => ({
        additionalInformation: "additionalInformation-1",
      }),
    })

    expect(screen.getByText("additionalInformation-1")).toBeOnTheScreen()
  })

  it("navigates to artwork screen + calls tracking on press", async () => {
    await renderWithRelay({
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

    await fireEvent.press(screen.getByText("Artwork 1"))

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
