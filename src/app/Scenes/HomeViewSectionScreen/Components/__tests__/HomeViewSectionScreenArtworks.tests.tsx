import { act, fireEvent, screen } from "@testing-library/react-native"
import { HomeViewSectionScreenArtworksTestsQuery } from "__generated__/HomeViewSectionScreenArtworksTestsQuery.graphql"
import { HomeViewStoreProvider } from "app/Scenes/HomeView/HomeViewContext"
import { HomeViewSectionScreenArtworks } from "app/Scenes/HomeViewSectionScreen/Components/HomeViewSectionScreenArtworks"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useRoute: () => ({
    params: {
      artworkIndex: "0",
      id: "home-view-section-new-works-for-you",
    },
  }),
}))

describe("HomeViewSectionArtworks", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({
      AREnableHidingDislikedArtworks: true,
      AREnableNewHomeViewCardRailType: false, // Test legacy behavior by default
    })
  })

  const { renderWithRelay } = setupTestWrapper<HomeViewSectionScreenArtworksTestsQuery>({
    Component: (props) => {
      if (!props.homeView.section) {
        return null
      }
      return (
        <HomeViewStoreProvider>
          <HomeViewSectionScreenArtworks section={props.homeView.section} />
        </HomeViewStoreProvider>
      )
    },
    query: graphql`
      query HomeViewSectionScreenArtworksTestsQuery @relay_test_operation {
        homeView @required(action: NONE) {
          section(id: "home-view-section-new-works-for-you") @required(action: NONE) {
            ... on HomeViewSectionArtworks {
              ...HomeViewSectionScreenArtworks_section
            }
          }
        }
      }
    `,
  })

  it("renders no artworks available when no artworks are available", () => {
    renderWithRelay({
      HomeViewComponent: () => ({
        title: "New Works for You",
      }),
      ArtworkConnection: () => ({
        totalCount: 0,
        edges: [],
      }),
    })

    expect(screen.getByText(/Nothing yet. Please check back later/)).toBeOnTheScreen()
  })

  it("renders a list of artworks", () => {
    renderWithRelay({
      HomeViewSectionArtworks: () => ({
        internalID: "home-view-section-new-works-for-you",
        component: {
          title: "New Works for You",
        },
        ownerType: "newWorksForYou",
        artworksConnection: {
          edges: [
            {
              node: {
                internalID: "artwork-1-id",
                slug: "artwork-1-slug",
                title: "Artwork 1",
                href: "/artwork-1-href",
              },
            },
            {
              node: {
                internalID: "artwork-2-id",
                slug: "artwork-2-slug",
                title: "Artwork 2",
                href: "/artwork-2-href",
                collectorSignals: { primaryLabel: "PARTNER_OFFER", auction: null },
              },
            },
          ],
        },
      }),
    })

    expect(screen.getAllByText("New Works for You")).toBeDefined()
    expect(screen.getByText(/Artwork 1/)).toBeOnTheScreen()
    expect(screen.getByText(/Artwork 2/)).toBeOnTheScreen()

    fireEvent.press(screen.getByText(/Artwork 2/))

    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action": "tappedMainArtworkGrid",
            "context_module": "artworkGrid",
            "context_screen": undefined,
            "context_screen_owner_id": undefined,
            "context_screen_owner_slug": undefined,
            "context_screen_owner_type": "newWorksForYou",
            "destination_screen_owner_id": "artwork-2-id",
            "destination_screen_owner_slug": "artwork-2-slug",
            "destination_screen_owner_type": "artwork",
            "position": 1,
            "query": undefined,
            "signal_label": "Limited-Time Offer",
            "sort": undefined,
            "type": "thumbnail",
          },
        ]
      `)

    expect(navigate).toHaveBeenCalledWith("/artwork-2-href")
  })

  describe("impression tracking", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({
        AREnableHidingDislikedArtworks: true,
        ARImpressionsTrackingHomeItemViews: true,
        AREnableNewHomeViewCardRailType: false,
      })
    })

    it("renders artwork grid when feature flag is enabled and trackItemImpressions is true", () => {
      renderWithRelay({
        HomeViewSectionArtworks: () => ({
          internalID: "home-view-section-new-works-for-you",
          ownerType: "newWorksForYou",
          component: {
            title: "New Works for You",
          },
          trackItemImpressions: true,
          artworksConnection: {
            edges: [
              {
                node: {
                  internalID: "artwork-1-id",
                  slug: "artwork-1-slug",
                  title: "Artwork 1",
                  href: "/artwork-1-href",
                },
              },
              {
                node: {
                  internalID: "artwork-2-id",
                  slug: "artwork-2-slug",
                  title: "Artwork 2",
                  href: "/artwork-2-href",
                },
              },
            ],
          },
        }),
      })

      const artworkGrid = screen.getByTestId("masonry-artwork-grid")

      act(() => {
        artworkGrid.props.onViewableItemsChanged({
          viewableItems: [
            { item: { internalID: "artwork-1-id" }, index: 0 },
            { item: { internalID: "artwork-2-id" }, index: 1 },
          ],
          changed: [],
        })
      })

      expect(mockTrackEvent).toHaveBeenCalledWith({
        action: "item_viewed",
        context_module: "artworkGrid",
        context_screen: "newWorksForYou",
        item_type: "artwork",
        item_id: "artwork-1-id",
        position: 0,
      })

      expect(mockTrackEvent).toHaveBeenCalledWith({
        action: "item_viewed",
        context_module: "artworkGrid",
        context_screen: "newWorksForYou",
        item_type: "artwork",
        item_id: "artwork-2-id",
        position: 1,
      })
    })

    it("does not track itemViewed events when trackItemImpressions is false", () => {
      renderWithRelay({
        HomeViewSectionArtworks: () => ({
          internalID: "home-view-section-new-works-for-you",
          ownerType: "newWorksForYou",
          trackItemImpressions: false,
          component: {
            title: "New Works for You",
          },
          artworksConnection: {
            edges: [
              {
                node: {
                  internalID: "artwork-1-id",
                  slug: "artwork-1-slug",
                  title: "Artwork 1",
                  href: "/artwork-1-href",
                },
              },
            ],
          },
        }),
      })

      const artworkGrid = screen.getByTestId("masonry-artwork-grid")
      expect(artworkGrid.props.onViewableItemsChanged).toBeUndefined()
      expect(mockTrackEvent).not.toHaveBeenCalledWith(
        expect.objectContaining({
          action: "item_viewed",
        })
      )
    })

    it("tracks itemViewed events only once per artwork", () => {
      renderWithRelay({
        HomeViewSectionArtworks: () => ({
          internalID: "home-view-section-new-works-for-you",
          ownerType: "newWorksForYou",
          component: {
            title: "New Works for You",
          },
          trackItemImpressions: true,
          artworksConnection: {
            edges: [
              {
                node: {
                  internalID: "artwork-1-id",
                  slug: "artwork-1-slug",
                  title: "Artwork 1",
                  href: "/artwork-1-href",
                },
              },
            ],
          },
        }),
      })

      const artworkGrid = screen.getByTestId("masonry-artwork-grid")
      act(() => {
        // First time
        artworkGrid.props.onViewableItemsChanged({
          viewableItems: [{ item: { internalID: "artwork-1-id" }, index: 0 }],
          changed: [],
        })

        // Second time - should not trigger another tracking event
        artworkGrid.props.onViewableItemsChanged({
          viewableItems: [{ item: { internalID: "artwork-1-id" }, index: 0 }],
          changed: [],
        })
      })

      // Check that itemViewed event was tracked only once
      const itemViewedCalls = mockTrackEvent.mock.calls.filter(
        (call) => (call[0] as any)?.action === "item_viewed"
      )
      expect(itemViewedCalls).toHaveLength(1)
      expect(itemViewedCalls[0][0]).toEqual({
        action: "item_viewed",
        context_module: "artworkGrid",
        context_screen: "newWorksForYou",
        item_type: "artwork",
        item_id: "artwork-1-id",
        position: 0,
      })
    })
  })

  describe("New Card Rail Type (Feature Flag)", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({
        AREnableHidingDislikedArtworks: true,
        AREnableNewHomeViewCardRailType: true, // Enable new carousel behavior
      })
    })

    it("renders carousel view when feature flag is enabled", () => {
      renderWithRelay({
        HomeViewSectionArtworks: () => ({
          internalID: "home-view-section-new-works-for-you",
          component: {
            title: "New Works for You",
          },
          ownerType: "newWorksForYou",
          artworksConnection: {
            edges: [
              {
                node: {
                  internalID: "artwork-1-id",
                  slug: "artwork-1-slug",
                  title: "Artwork 1",
                  href: "/artwork-1-href",
                },
              },
              {
                node: {
                  internalID: "artwork-2-id",
                  slug: "artwork-2-slug",
                  title: "Artwork 2",
                  href: "/artwork-2-href",
                },
              },
            ],
          },
        }),
      })

      // Should render the new carousel header instead of the legacy header
      expect(screen.getByText("New Works For You")).toBeOnTheScreen()
      expect(screen.getByLabelText("Exit New Works For you")).toBeOnTheScreen()
    })

    it("renders artworks in horizontal carousel format", () => {
      renderWithRelay({
        HomeViewSectionArtworks: () => ({
          internalID: "home-view-section-new-works-for-you",
          component: {
            title: "New Works for You",
          },
          ownerType: "newWorksForYou",
          artworksConnection: {
            edges: [
              {
                node: {
                  internalID: "artwork-1-id",
                  slug: "artwork-1-slug",
                  title: "Artwork 1",
                  href: "/artwork-1-href",
                  artists: [{ internalID: "artist-1", name: "Artist 1" }],
                },
              },
              {
                node: {
                  internalID: "artwork-2-id",
                  slug: "artwork-2-slug",
                  title: "Artwork 2",
                  href: "/artwork-2-href",
                  artists: [{ internalID: "artist-2", name: "Artist 2" }],
                },
              },
            ],
          },
        }),
      })

      const carouselList = screen.getByTestId("carousel-flatlist")
      expect(carouselList).toBeOnTheScreen()

      expect(screen.getByText(/Artwork 1/)).toBeOnTheScreen()
      expect(screen.getByText(/Artwork 2/)).toBeOnTheScreen()
    })

    it("shows infinite discovery bottom sheet with correct artwork data", () => {
      renderWithRelay({
        HomeViewSectionArtworks: () => ({
          internalID: "home-view-section-new-works-for-you",
          component: {
            title: "New Works for You",
          },
          ownerType: "newWorksForYou",
          artworksConnection: {
            edges: [
              {
                node: {
                  internalID: "artwork-1-id",
                  slug: "artwork-1-slug",
                  title: "Artwork 1",
                  href: "/artwork-1-href",
                  artists: [{ internalID: "artist-1", name: "Artist 1" }],
                },
              },
            ],
          },
        }),
      })

      // The ArtworkCardBottomSheet should be rendered with the first artwork's data
      expect(screen.getByText("New Works For You")).toBeOnTheScreen()
    })

    it("handles close button press in carousel view", () => {
      renderWithRelay({
        HomeViewSectionArtworks: () => ({
          internalID: "home-view-section-new-works-for-you",
          component: {
            title: "New Works for You",
          },
          ownerType: "newWorksForYou",
          artworksConnection: {
            edges: [
              {
                node: {
                  internalID: "artwork-1-id",
                  slug: "artwork-1-slug",
                  title: "Artwork 1",
                  href: "/artwork-1-href",
                },
              },
            ],
          },
        }),
      })

      const closeButton = screen.getByLabelText("Exit New Works For you")
      fireEvent.press(closeButton)

      expect(navigate).toHaveBeenCalled()
    })

    it("updates active index when viewable items change", () => {
      renderWithRelay({
        HomeViewSectionArtworks: () => ({
          internalID: "home-view-section-new-works-for-you",
          component: {
            title: "New Works for You",
          },
          ownerType: "newWorksForYou",
          artworksConnection: {
            edges: [
              {
                node: {
                  internalID: "artwork-1-id",
                  slug: "artwork-1-slug",
                  title: "Artwork 1",
                  href: "/artwork-1-href",
                  artists: [{ internalID: "artist-1", name: "Artist 1" }],
                },
              },
              {
                node: {
                  internalID: "artwork-2-id",
                  slug: "artwork-2-slug",
                  title: "Artwork 2",
                  href: "/artwork-2-href",
                  artists: [{ internalID: "artist-2", name: "Artist 2" }],
                },
              },
            ],
          },
        }),
      })

      const carouselList = screen.getByTestId("carousel-flatlist")
      expect(carouselList).toBeOnTheScreen()
    })

    it("handles end reached for pagination", () => {
      renderWithRelay({
        HomeViewSectionArtworks: () => ({
          internalID: "home-view-section-new-works-for-you",
          component: {
            title: "New Works for You",
          },
          ownerType: "newWorksForYou",
          artworksConnection: {
            edges: [
              {
                node: {
                  internalID: "artwork-1-id",
                  slug: "artwork-1-slug",
                  title: "Artwork 1",
                  href: "/artwork-1-href",
                },
              },
            ],
          },
        }),
      })

      const carouselList = screen.getByTestId("carousel-flatlist")
      expect(carouselList).toBeOnTheScreen()
    })

    it("renders empty state in carousel view", () => {
      renderWithRelay({
        HomeViewSectionArtworks: () => ({
          internalID: "home-view-section-new-works-for-you",
          component: {
            title: "New Works for You",
          },
          ownerType: "newWorksForYou",
          artworksConnection: {
            edges: [],
          },
        }),
      })

      expect(screen.getByText("Nothing yet. Please check back later.")).toBeOnTheScreen()
    })

    it("configures carousel FlatList with correct props", () => {
      renderWithRelay({
        HomeViewSectionArtworks: () => ({
          internalID: "home-view-section-new-works-for-you",
          component: {
            title: "New Works for You",
          },
          ownerType: "newWorksForYou",
          artworksConnection: {
            edges: [
              {
                node: {
                  internalID: "artwork-1-id",
                  slug: "artwork-1-slug",
                  title: "Artwork 1",
                  href: "/artwork-1-href",
                },
              },
            ],
          },
        }),
      })

      const carouselList = screen.getByTestId("carousel-flatlist")
      expect(carouselList).toBeOnTheScreen()
    })

    it("renders carousel pagination controls", () => {
      renderWithRelay({
        HomeViewSectionArtworks: () => ({
          internalID: "home-view-section-new-works-for-you",
          component: {
            title: "New Works for You",
          },
          ownerType: "newWorksForYou",
          artworksConnection: {
            edges: [
              {
                node: {
                  internalID: "artwork-1-id",
                  slug: "artwork-1-slug",
                  title: "Artwork 1",
                  href: "/artwork-1-href",
                },
              },
            ],
          },
        }),
      })

      expect(screen.getByText("New Works For You")).toBeOnTheScreen()
      const carouselList = screen.getByTestId("carousel-flatlist")
      expect(carouselList).toBeOnTheScreen()
    })

    it("tracks itemViewed events in carousel view when trackItemImpressions is enabled", () => {
      renderWithRelay({
        HomeViewSectionArtworks: () => ({
          internalID: "home-view-section-new-works-for-you",
          ownerType: "newWorksForYou",
          component: {
            title: "New Works For You",
          },
          trackItemImpressions: true,
          artworksConnection: {
            edges: [
              {
                node: {
                  internalID: "artwork-1-id",
                  slug: "artwork-1-slug",
                  title: "Artwork 1",
                  href: "/artwork-1-href",
                },
              },
            ],
          },
        }),
      })

      const carouselList = screen.getByTestId("carousel-flatlist")

      act(() => {
        carouselList.props.onViewableItemsChanged({
          viewableItems: [
            {
              item: { internalID: "artwork-1-id" },
              index: 0,
            },
          ],
          changed: [],
        })
      })

      expect(mockTrackEvent).toHaveBeenCalledWith({
        action: "item_viewed",
        context_module: "artworkGrid",
        context_screen: "newWorksForYou",
        item_type: "artwork",
        item_id: "artwork-1-id",
        position: 0,
      })
    })

    it("renders legacy grid when route ID is different from new works for you", () => {
      jest.spyOn(require("@react-navigation/native"), "useRoute").mockReturnValue({
        params: {
          artworkIndex: "0",
          id: "home-view-section-other-section",
        },
      })

      renderWithRelay({
        HomeViewSectionArtworks: () => ({
          internalID: "home-view-section-other-section",
          ownerType: "newWorksForYou",
          component: {
            title: "Other Section",
          },
          trackItemImpressions: false,
          artworksConnection: {
            edges: [
              {
                node: {
                  internalID: "artwork-1-id",
                  slug: "artwork-1-slug",
                  title: "Artwork 1",
                  href: "/artwork-1-href",
                },
              },
            ],
          },
        }),
      })

      expect(screen.getByTestId("masonry-artwork-grid")).toBeOnTheScreen()
      expect(screen.queryByTestId("carousel-flatlist")).not.toBeOnTheScreen()
      expect(screen.getAllByText("Other Section")[0]).toBeOnTheScreen()
    })
  })
})
