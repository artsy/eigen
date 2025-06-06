import { fireEvent, screen } from "@testing-library/react-native"
import { CardRailCard } from "app/Components/CardRail/CardRailCard"
import { GenericArtistSeriesRail } from "app/Components/GenericArtistSeriesRail"
import { CollectionArtistSeriesRail } from "app/Scenes/Collection/Components/CollectionHubsRails/ArtistSeries/CollectionArtistSeriesRail"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("Artist Series Rail", () => {
  describe("Trending Artists Rail", () => {
    let props: any /* STRICTNESS_MIGRATION */
    beforeEach(() => {
      props = {
        collectionGroup:
          CollectionHubRailsArtistSeriesFixture?.marketingCollection?.linkedCollections[0],
        collection: CollectionHubRailsArtistSeriesFixture?.marketingCollection,
      }
    })

    it("renders without throwing an error", () => {
      renderWithWrappers(<CollectionArtistSeriesRail {...props} />)

      expect(screen.UNSAFE_getAllByType(GenericArtistSeriesRail)).toHaveLength(1)
    })

    it("correctly tracks when a collection is tapped", () => {
      renderWithWrappers(<CollectionArtistSeriesRail {...props} />)

      const railCard = screen.UNSAFE_getAllByType(CardRailCard)[0]

      fireEvent.press(railCard)

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

    it("renders three artist series in the Trending Artists Series", () => {
      renderWithWrappers(<CollectionArtistSeriesRail {...props} />)

      expect(screen.getByText("Cindy Sherman: Untitled Film Stills")).toBeOnTheScreen()
      expect(screen.getByText("Damien Hirst: Butterflies")).toBeOnTheScreen()
      expect(screen.getByText("Hunt Slonem: Bunnies")).toBeOnTheScreen()
    })

    it("renders three images in an artist series", () => {
      renderWithWrappers(<CollectionArtistSeriesRail {...props} />)

      const img1 = screen.getAllByTestId("image-1")[0]
      const img2 = screen.getAllByTestId("image-2")[0]
      const img3 = screen.getAllByTestId("image-3")[0]

      expect(img1).toBeOnTheScreen()
      expect(img2).toBeOnTheScreen()
      expect(img3).toBeOnTheScreen()
    })

    it("renders the collection hub rail title", () => {
      renderWithWrappers(<CollectionArtistSeriesRail {...props} />)

      expect(screen.getByText("Trending Artist Series")).toBeOnTheScreen()
    })

    it("renders each artist series' title", () => {
      renderWithWrappers(<CollectionArtistSeriesRail {...props} />)

      expect(screen.getByText("Cindy Sherman: Untitled Film Stills")).toBeOnTheScreen()
      expect(screen.getByText("Damien Hirst: Butterflies")).toBeOnTheScreen()
      expect(screen.getByText("Hunt Slonem: Bunnies")).toBeOnTheScreen()
    })

    it("renders each artist series' metadata", () => {
      renderWithWrappers(<CollectionArtistSeriesRail {...props} />)

      expect(screen.getByText("From $20,000")).toBeOnTheScreen()
      expect(screen.getByText("From $7,500")).toBeOnTheScreen()
      expect(screen.getByText("From $2,000")).toBeOnTheScreen()
    })

    it("navigates to a new collection when a series is tapped", () => {
      renderWithWrappers(<CollectionArtistSeriesRail {...props} />)

      fireEvent.press(screen.getByText("Cindy Sherman: Untitled Film Stills"))
      expect(navigate).toHaveBeenCalledWith("/collection/cindy-sherman-untitled-film-stills")

      fireEvent.press(screen.getByText("Damien Hirst: Butterflies"))
      expect(navigate).toHaveBeenCalledWith("/collection/damien-hirst-butterflies")

      fireEvent.press(screen.getByText("Hunt Slonem: Bunnies"))
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
            artworksConnection: {
              id: "conn1",
              edges: [
                {
                  node: {
                    id: "artwork1",
                    title: "Untitled (Film Still) Tray",
                    image: {
                      url: "https://cindy-sherman-untitled-film-stills/medium.jpg",
                    },
                  },
                },
                {
                  node: {
                    id: "artwork2",
                    title: "Untitled (Film Still) Tray 2",
                    image: {
                      url: "https://cindy-sherman-untitled-film-stills-2/medium.jpg",
                    },
                  },
                },
                {
                  node: {
                    id: "artwork3",
                    title: "Untitled (Film Still) Tray 3",
                    image: {
                      url: "https://cindy-sherman-untitled-film-stills-3/medium.jpg",
                    },
                  },
                },
              ],
            },
          },
          {
            slug: "damien-hirst-butterflies",
            id: "collection2",
            title: "Damien Hirst: Butterflies",
            priceGuidance: 7500,
            artworksConnection: {
              id: "conn2",
              edges: [
                {
                  node: {
                    id: "artwork4",
                    title: "Untitled (Film Still) Tray",
                    image: {
                      url: "https://damien-hirst-butterflies/larger.jpg",
                    },
                  },
                },
                {
                  node: {
                    id: "artwork5",
                    title: "Untitled (Film Still) Tray 2",
                    image: {
                      url: "https://damien-hirst-butterflies-2/larger.jpg",
                    },
                  },
                },
                {
                  node: {
                    id: "artwork6",
                    title: "Untitled (Film Still) Tray 3",
                    image: {
                      url: "https://damien-hirst-butterflies-3/larger.jpg",
                    },
                  },
                },
              ],
            },
          },
          {
            slug: "hunt-slonem-bunnies",
            id: "collection3",
            title: "Hunt Slonem: Bunnies",
            priceGuidance: 2000,
            artworksConnection: {
              id: "conn3",
              edges: [
                {
                  node: {
                    id: "artwork7",
                    title: "Untitled",
                    image: {
                      url: "https://hunt-slonem-bunnies/medium.jpg",
                    },
                  },
                },
                {
                  node: {
                    id: "artwork8",
                    title: "Untitled2",
                    image: {
                      url: "https://hunt-slonem-bunnies-2/medium.jpg",
                    },
                  },
                },
                {
                  node: {
                    id: "artwork9",
                    title: "Untitled3",
                    image: {
                      url: "https://hunt-slonem-bunnies-3/medium.jpg",
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    ],
  },
}
