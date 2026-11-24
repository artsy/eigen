import { fireEvent, screen } from "@testing-library/react-native"
import { CollectionArtistSeriesRail } from "app/Scenes/Collection/Components/CollectionHubsRails/ArtistSeries/CollectionArtistSeriesRail"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { ComponentProps } from "react"

describe("Artist Series Rail", () => {
  describe("Trending Artists Rail", () => {
    let props: ComponentProps<typeof CollectionArtistSeriesRail>
    beforeEach(() => {
      props = {
        collectionGroup:
          CollectionHubRailsArtistSeriesFixture?.marketingCollection?.linkedCollections[0],
        collection: CollectionHubRailsArtistSeriesFixture?.marketingCollection,
      } as unknown as ComponentProps<typeof CollectionArtistSeriesRail>
    })

    it("renders without throwing an error", async () => {
      await renderWithWrappers(<CollectionArtistSeriesRail {...props} />)

      // GenericArtistSeriesRail renders the linked collections
      expect(screen.getByText("Cindy Sherman: Untitled Film Stills")).toBeOnTheScreen()
    })

    it("correctly tracks when a collection is tapped", async () => {
      await renderWithWrappers(<CollectionArtistSeriesRail {...props} />)

      const railCard = screen.getByText("Cindy Sherman: Untitled Film Stills")

      await fireEvent.press(railCard)

      expect(mockTrackEvent).toBeCalledWith({
        action_type: "tappedCollectionGroup",
        context_module: "artistSeriesRail",
        context_screen_owner_id: "collection0",
        context_screen_owner_slug: "cool-collection",
        context_screen_owner_type: "Collection",
        destination_screen_owner_id: "collection1",
        destination_screen_owner_slug: "cindy-sherman-untitled-film-stills",
        destination_screen_owner_type: "Collection",
        horizontal_slide_position: 0,
        type: "thumbnail",
      })
    })

    it("renders three artist series in the Trending Artists Series", async () => {
      await renderWithWrappers(<CollectionArtistSeriesRail {...props} />)

      expect(screen.getByText("Cindy Sherman: Untitled Film Stills")).toBeOnTheScreen()
      expect(screen.getByText("Damien Hirst: Butterflies")).toBeOnTheScreen()
      expect(screen.getByText("Hunt Slonem: Bunnies")).toBeOnTheScreen()
    })

    it("renders three images in an artist series", async () => {
      await renderWithWrappers(<CollectionArtistSeriesRail {...props} />)

      const img1 = screen.getAllByTestId("image-1")[0]
      const img2 = screen.getAllByTestId("image-2")[0]
      const img3 = screen.getAllByTestId("image-3")[0]

      expect(img1).toBeOnTheScreen()
      expect(img2).toBeOnTheScreen()
      expect(img3).toBeOnTheScreen()
    })

    it("renders the collection hub rail title", async () => {
      await renderWithWrappers(<CollectionArtistSeriesRail {...props} />)

      expect(screen.getByText("Trending Artist Series")).toBeOnTheScreen()
    })

    it("renders each artist series' title", async () => {
      await renderWithWrappers(<CollectionArtistSeriesRail {...props} />)

      expect(screen.getByText("Cindy Sherman: Untitled Film Stills")).toBeOnTheScreen()
      expect(screen.getByText("Damien Hirst: Butterflies")).toBeOnTheScreen()
      expect(screen.getByText("Hunt Slonem: Bunnies")).toBeOnTheScreen()
    })

    it("renders each artist series' metadata", async () => {
      await renderWithWrappers(<CollectionArtistSeriesRail {...props} />)

      expect(screen.getByText("From $20,000")).toBeOnTheScreen()
      expect(screen.getByText("From $7,500")).toBeOnTheScreen()
      expect(screen.getByText("From $2,000")).toBeOnTheScreen()
    })

    it("navigates to a new collection when a series is tapped", async () => {
      await renderWithWrappers(<CollectionArtistSeriesRail {...props} />)

      await fireEvent.press(screen.getByText("Cindy Sherman: Untitled Film Stills"))
      expect(navigate).toHaveBeenCalledWith("/collection/cindy-sherman-untitled-film-stills")

      await fireEvent.press(screen.getByText("Damien Hirst: Butterflies"))
      expect(navigate).toHaveBeenCalledWith("/collection/damien-hirst-butterflies")

      await fireEvent.press(screen.getByText("Hunt Slonem: Bunnies"))
      expect(navigate).toHaveBeenCalledWith("/collection/hunt-slonem-bunnies")
    })
  })
})

const CollectionHubRailsArtistSeriesFixture = {
  marketingCollection: {
    id: "collection0",
    slug: "cool-collection",
    linkedCollections: [
      {
        groupType: "ArtistSeries",
        name: "Trending Artist Series",
        members: [
          {
            slug: "cindy-sherman-untitled-film-stills",
            id: "collection1",
            title: "Cindy Sherman: Untitled Film Stills",
            priceGuidance: 20000,
            representativeArtworks: [
              { image: { url: "https://cindy-sherman-untitled-film-stills/medium.jpg" } },
              { image: { url: "https://cindy-sherman-untitled-film-stills-2/medium.jpg" } },
              { image: { url: "https://cindy-sherman-untitled-film-stills-3/medium.jpg" } },
            ],
          },
          {
            slug: "damien-hirst-butterflies",
            id: "collection2",
            title: "Damien Hirst: Butterflies",
            priceGuidance: 7500,
            representativeArtworks: [
              { image: { url: "https://damien-hirst-butterflies/larger.jpg" } },
              { image: { url: "https://damien-hirst-butterflies-2/larger.jpg" } },
              { image: { url: "https://damien-hirst-butterflies-3/larger.jpg" } },
            ],
          },
          {
            slug: "hunt-slonem-bunnies",
            id: "collection3",
            title: "Hunt Slonem: Bunnies",
            priceGuidance: 2000,
            representativeArtworks: [
              { image: { url: "https://hunt-slonem-bunnies/medium.jpg" } },
              { image: { url: "https://hunt-slonem-bunnies-2/medium.jpg" } },
              { image: { url: "https://hunt-slonem-bunnies-3/medium.jpg" } },
            ],
          },
        ],
      },
    ],
  },
}
