import { fireEvent, waitFor, screen } from "@testing-library/react-native"
import { MyCollectionArtworkHeaderTestQuery } from "__generated__/MyCollectionArtworkHeaderTestQuery.graphql"
import { MyCollectionArtworkHeader } from "app/Scenes/MyCollection/Screens/Artwork/Components/MyCollectionArtworkHeader"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("MyCollectionArtworkHeader", () => {
  const { renderWithRelay } = setupTestWrapper<MyCollectionArtworkHeaderTestQuery>({
    Component: (props) => <MyCollectionArtworkHeader artwork={props.artwork!} />,
    query: graphql`
      query MyCollectionArtworkHeaderTestQuery @relay_test_operation {
        artwork(id: "artwork-id") {
          ...MyCollectionArtworkHeader_artwork
        }
      }
    `,
  })

  it("fires the analytics tracking event when image is pressed", () => {
    renderWithRelay({
      Artwork: () => ({
        internalID: "someInternalId",
        slug: "someSlug",
      }),
    })

    const carouselImage = screen.getByLabelText("Image with Loading State")
    fireEvent(carouselImage, "Press")
    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action_name: "artworkImageZoom",
      action_type: "tap",
      context_module: "ArtworkImage",
    })
  })

  it("shows fallback view when images are null", async () => {
    renderWithRelay({
      Artwork: () => ({
        artistNames: "names",
        date: new Date().toISOString(),
        figures: null,
        internalID: "internal-id",
        title: "a title",
        slug: "some-slug",
      }),
    })

    await waitFor(() => {
      const fallbackView = screen.getByTestId("MyCollectionArtworkHeaderFallback")
      expect(fallbackView).toBeDefined()
    })
  })
})
