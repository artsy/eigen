import { fireEvent, waitFor, screen } from "@testing-library/react-native"
import { MyCollectionArtworkHeaderTestQuery } from "__generated__/MyCollectionArtworkHeaderTestQuery.graphql"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
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

  describe("AREnableSubmitArtworkTier2Information feature flag is off", () => {
    it("renders without throwing an error", () => {
      renderWithRelay({
        Artwork: () => ({
          artistNames: "some artist name",
          date: "Jan 20th",
          image: {
            url: "some/url",
          },
          title: "some title",
        }),
      })

      expect(screen.getByText("some artist name")).toBeTruthy()
      expect(screen.getByText("some title, Jan 20th")).toBeTruthy()
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

  describe("AREnableSubmitArtworkTier2Information feature flag is on", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({
        AREnableSubmitArtworkTier2Information: true,
      })
    })

    it("renders submission component when submission is not in REJECTED state", async () => {
      renderWithRelay({
        Artwork: () => ({
          artistNames: "names",
          date: new Date().toISOString(),
          figures: null,
          internalID: "internal-id",
          title: "a title",
          slug: "some-slug",
          consignmentSubmission: {
            state: "APPROVED",
          },
        }),
      })
      expect(screen.queryByTestId("MyCollectionArtworkSubmissionStatus-Container")).not.toBe(null)
    })

    it("does not render the submission component when submission is in REJECTED state", async () => {
      renderWithRelay({
        Artwork: () => ({
          artistNames: "names",
          date: new Date().toISOString(),
          figures: null,
          internalID: "internal-id",
          title: "a title",
          slug: "some-slug",
          consignmentSubmission: {
            state: "REJECTED",
          },
        }),
      })

      expect(screen.queryByTestId("MyCollectionArtworkSubmissionStatus-Container")).toBe(null)
    })
  })
})
