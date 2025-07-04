import { act, fireEvent, screen } from "@testing-library/react-native"
import { HomeViewSectionScreenArtworksTestsQuery } from "__generated__/HomeViewSectionScreenArtworksTestsQuery.graphql"
import { HomeViewStoreProvider } from "app/Scenes/HomeView/HomeViewContext"
import { HomeViewSectionScreenArtworks } from "app/Scenes/HomeViewSectionScreen/HomeViewSectionScreenArtworks"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { FlatList } from "react-native"
import { graphql } from "react-relay"

describe("HomeViewSectionArtworks", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableHidingDislikedArtworks: true })
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
      })
    })

    it("tracks itemViewed events when feature flag is enabled and rail is visible", async () => {
      const { UNSAFE_root } = renderWithRelay({
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

      // Find the Grid component and trigger onViewableItemsChanged
      const artworkRail = await UNSAFE_root.findByType(FlatList)

      act(() => {
        artworkRail.props.onViewableItemsChanged({
          viewableItems: [
            { item: { internalID: "artwork-1-id" }, index: 0 },
            { item: { internalID: "artwork-2-id" }, index: 1 },
          ],
          changed: [],
        })
      })

      // Check that itemViewed events were tracked
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

    it("does not track itemViewed events when trackItemImpressions is false", async () => {
      const { UNSAFE_root } = renderWithRelay({
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

      // Find the Grid component
      const artworkRail = await UNSAFE_root.findByType(FlatList)

      // onViewableItemsChanged should be undefined when trackItemImpressions is false
      expect(artworkRail.props.onViewableItemsChanged).toBeUndefined()

      // Check that no itemViewed events were tracked
      expect(mockTrackEvent).not.toHaveBeenCalledWith(
        expect.objectContaining({
          action: "item_viewed",
        })
      )
    })

    it("tracks itemViewed events only once per artwork", async () => {
      const { UNSAFE_root } = renderWithRelay({
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

      // Find the Grid component and trigger onViewableItemsChanged multiple times
      const artworkRail = await UNSAFE_root.findByType(FlatList)

      act(() => {
        // First time
        artworkRail.props.onViewableItemsChanged({
          viewableItems: [{ item: { internalID: "artwork-1-id" }, index: 0 }],
          changed: [],
        })

        // Second time - should not trigger another tracking event
        artworkRail.props.onViewableItemsChanged({
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
})
