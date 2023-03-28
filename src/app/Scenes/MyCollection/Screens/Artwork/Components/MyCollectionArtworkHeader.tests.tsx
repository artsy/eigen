import { fireEvent, waitFor } from "@testing-library/react-native"
import { MyCollectionArtworkHeaderTestQuery } from "__generated__/MyCollectionArtworkHeaderTestQuery.graphql"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { MyCollectionArtworkHeader } from "./MyCollectionArtworkHeader"

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

  it("renders without throwing an error", () => {
    const { getByText } = renderWithRelay({
      Artwork: () => ({
        artistNames: "some artist name",
        date: "Jan 20th",
        image: {
          url: "some/url",
        },
        title: "some title",
      }),
    })

    expect(getByText("some artist name")).toBeTruthy()
    expect(getByText("some title, Jan 20th")).toBeTruthy()
  })

  it("fires the analytics tracking event when image is pressed", () => {
    const { getByLabelText } = renderWithRelay({
      Artwork: () => ({
        internalID: "someInternalId",
        slug: "someSlug",
      }),
    })

    const carouselImage = getByLabelText("Image with Loading State")
    fireEvent(carouselImage, "Press")
    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action_name: "artworkImageZoom",
      action_type: "tap",
      context_module: "ArtworkImage",
    })
  })

  it("shows fallback view when images are null", async () => {
    const { getByTestId } = renderWithRelay({
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
      const fallbackView = getByTestId("MyCollectionArtworkHeaderFallback")
      expect(fallbackView).toBeDefined()
    })
  })
})
