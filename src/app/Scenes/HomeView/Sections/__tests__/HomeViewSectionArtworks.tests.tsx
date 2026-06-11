import { act, fireEvent, screen } from "@testing-library/react-native"
import { HomeViewSectionArtworksTestsQuery } from "__generated__/HomeViewSectionArtworksTestsQuery.graphql"
import {
  HomeViewStore,
  HomeViewStoreModel,
  HomeViewStoreProvider,
} from "app/Scenes/HomeView/HomeViewContext"
import { HomeViewSectionArtworks } from "app/Scenes/HomeView/Sections/HomeViewSectionArtworks"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { useExperimentFlag } from "app/system/flags/hooks/useExperimentFlag"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Actions } from "easy-peasy"
import { useEffect } from "react"
import { FlatList } from "react-native"
import { graphql } from "react-relay"
import { MockPayloadGenerator } from "relay-test-utils"

jest.mock("app/system/flags/hooks/useExperimentFlag", () => ({
  useExperimentFlag: jest.fn(),
}))

const mockUseExperimentFlag = useExperimentFlag as jest.Mock

let homeViewStoreActions: Actions<HomeViewStoreModel>

// This is a workaround to access the actions of the HomeViewStore in the test
const HomeViewStoreVisitor: React.FC = () => {
  const actions = HomeViewStore.useStoreActions((actions) => actions)

  useEffect(() => {
    homeViewStoreActions = actions
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

describe("HomeViewSectionArtworks", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableHidingDislikedArtworks: true })
  })

  const { renderWithRelay } = setupTestWrapper<HomeViewSectionArtworksTestsQuery>({
    Component: (props) => {
      if (!props.homeView.section) {
        return null
      }
      return (
        <HomeViewStoreProvider>
          <HomeViewStoreVisitor />
          <HomeViewSectionArtworks section={props.homeView.section} index={0} />
        </HomeViewStoreProvider>
      )
    },
    query: graphql`
      query HomeViewSectionArtworksTestsQuery @relay_test_operation {
        homeView {
          section(id: "home-view-section-new-works-for-you") {
            ... on HomeViewSectionArtworks {
              ...HomeViewSectionArtworks_section @arguments(enableHidingDislikedArtworks: true)
            }
          }
        }
      }
    `,
  })

  it("renders nothing when no artworks", () => {
    const { toJSON } = renderWithRelay({
      HomeViewComponent: () => ({
        title: "New Works for You",
      }),
      ArtworkConnection: () => ({
        totalCount: 0,
        edges: [],
      }),
    })

    expect(toJSON()).toBeNull()
  })

  it("renders a list of artworks", () => {
    renderWithRelay({
      HomeViewSectionArtworks: () => ({
        internalID: "home-view-section-new-works-for-you",
        component: {
          title: "New Works for You",
        },
        showArtworksCardView: false,
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

    // Verify that new ArtworksCard is not rendered
    expect(screen.queryByTestId("artworks-card")).not.toBeOnTheScreen()

    expect(screen.getByText("New Works for You")).toBeOnTheScreen()
    expect(screen.getByText(/Artwork 1/)).toBeOnTheScreen()
    expect(screen.getByText(/Artwork 2/)).toBeOnTheScreen()

    fireEvent.press(screen.getByText(/Artwork 2/))

    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action": "tappedArtworkGroup",
            "context_module": "<mock-value-for-field-"contextModule">",
            "context_screen_owner_type": "home",
            "destination_screen_owner_id": "artwork-2-id",
            "destination_screen_owner_slug": "artwork-2-slug",
            "destination_screen_owner_type": "artwork",
            "horizontal_slide_position": 1,
            "module_height": "single",
            "signal_label": "Limited-Time Offer",
            "type": "thumbnail",
          },
        ]
      `)

    expect(navigate).toHaveBeenCalledWith("/artwork-2-href")
  })

  it("does not render disliked artworks when enabled", () => {
    renderWithRelay({
      HomeViewSectionArtworks: () => ({
        internalID: "home-view-section-new-works-for-you",
        contextModule: "newWorksForYouRail",
        artworksConnection: {
          edges: [
            {
              node: {
                internalID: "artwork-1-id",
                slug: "artwork-1-slug",
                title: "Artwork 1",
                href: "/artwork-1-href",
                isDisliked: true,
              },
            },
          ],
        },
      }),
    })

    expect(screen.queryByText(/Artwork 1/)).not.toBeOnTheScreen()
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
          contextModule: "newWorksForYouRail",
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

      homeViewStoreActions.setViewableSections(["home-view-section-new-works-for-you"])

      // Find the ArtworkRail component and trigger onViewableItemsChanged
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
        context_module: "newWorksForYouRail",
        context_screen: "home",
        item_type: "artwork",
        item_id: "artwork-1-id",
        position: 0,
      })

      expect(mockTrackEvent).toHaveBeenCalledWith({
        action: "item_viewed",
        context_module: "newWorksForYouRail",
        context_screen: "home",
        item_type: "artwork",
        item_id: "artwork-2-id",
        position: 1,
      })
    })

    it("does not track itemViewed events when rail is not visible", async () => {
      const { UNSAFE_root } = renderWithRelay({
        HomeViewSectionArtworks: () => ({
          internalID: "home-view-section-new-works-for-you",
          contextModule: "newWorksForYouRail",
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

      homeViewStoreActions.setViewableSections([])

      // Find the ArtworkRail component and trigger onViewableItemsChanged
      const artworkRail = await UNSAFE_root.findByType(FlatList)

      act(() => {
        artworkRail.props.onViewableItemsChanged({
          viewableItems: [{ item: { internalID: "artwork-1-id" }, index: 0 }],
          changed: [],
        })
      })

      // Check that no itemViewed events were tracked
      expect(mockTrackEvent).not.toHaveBeenCalledWith(
        expect.objectContaining({
          action: "item_viewed",
        })
      )
    })

    it("does not track itemViewed events when trackItemImpressions is false", async () => {
      const { UNSAFE_root } = renderWithRelay({
        HomeViewSectionArtworks: () => ({
          internalID: "home-view-section-new-works-for-you",
          contextModule: "newWorksForYouRail",
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

      homeViewStoreActions.setViewableSections(["home-view-section-new-works-for-you"])

      // Find the ArtworkRail component
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
          contextModule: "newWorksForYouRail",
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

      homeViewStoreActions.setViewableSections(["home-view-section-new-works-for-you"])

      // Find the ArtworkRail component and trigger onViewableItemsChanged multiple times
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
        context_module: "newWorksForYouRail",
        context_screen: "home",
        item_type: "artwork",
        item_id: "artwork-1-id",
        position: 0,
      })
    })
  })

  describe("live recommendations", () => {
    const RECOMMENDED_SECTION = {
      internalID: "home-view-section-recommended-artworks",
      contextModule: "newWorksForYouRail",
      component: { title: "We think you'll love" },
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
    }

    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({
        AREnableHidingDislikedArtworks: true,
        ARImpressionsTrackingHomeItemViews: true,
      })
      // Both Unleash flags (eigen + gravity) on
      mockUseExperimentFlag.mockReturnValue(true)
    })

    afterEach(() => {
      mockUseExperimentFlag.mockReturnValue(false)
    })

    it("re-fires railViewed only after the live refresh completes", () => {
      const { env } = renderWithRelay({
        HomeViewSectionArtworks: () => RECOMMENDED_SECTION,
      })

      homeViewStoreActions.setViewableSections(["home-view-section-recommended-artworks"])
      mockTrackEvent.mockClear()

      // Request a refresh (focus return / pull to refresh).
      act(() => {
        homeViewStoreActions.bumpLiveRefetchKey()
      })

      // Nothing fires yet — the refreshed data hasn't landed.
      expect(mockTrackEvent).not.toHaveBeenCalledWith(
        expect.objectContaining({ action: "railViewed" })
      )

      // Once the forced refetch completes, railViewed fires for the fresh data.
      act(() => {
        env.mock.resolveMostRecentOperation((operation) =>
          MockPayloadGenerator.generate(operation, {
            HomeViewSectionArtworks: () => RECOMMENDED_SECTION,
          })
        )
      })

      expect(mockTrackEvent).toHaveBeenCalledWith({
        action: "railViewed",
        context_module: "newWorksForYouRail",
        context_screen: "home",
        position_y: 0,
      })
    })

    it("re-enables itemViewed tracking after the live refresh completes", async () => {
      const { env, UNSAFE_root } = renderWithRelay({
        HomeViewSectionArtworks: () => RECOMMENDED_SECTION,
      })

      homeViewStoreActions.setViewableSections(["home-view-section-recommended-artworks"])

      const artworkRail = await UNSAFE_root.findByType(FlatList)
      const onViewableItemsChanged = artworkRail.props.onViewableItemsChanged
      const viewableItems = [{ item: { internalID: "artwork-1-id" }, index: 0 }]

      // Item is tracked once initially.
      act(() => {
        onViewableItemsChanged({ viewableItems, changed: [] })
      })

      expect(
        mockTrackEvent.mock.calls.filter((call) => (call[0] as any)?.action === "item_viewed")
      ).toHaveLength(1)

      // Refresh the rail and complete it — the impression guard resets on completion.
      act(() => {
        homeViewStoreActions.bumpLiveRefetchKey()
      })
      act(() => {
        env.mock.resolveMostRecentOperation((operation) =>
          MockPayloadGenerator.generate(operation, {
            HomeViewSectionArtworks: () => RECOMMENDED_SECTION,
          })
        )
      })

      // The same item becoming viewable again should re-fire after the refresh.
      act(() => {
        onViewableItemsChanged({ viewableItems, changed: [] })
      })

      expect(
        mockTrackEvent.mock.calls.filter((call) => (call[0] as any)?.action === "item_viewed")
      ).toHaveLength(2)
    })

    it("does not re-fire analytics when the flags are off", () => {
      mockUseExperimentFlag.mockReturnValue(false)

      renderWithRelay({
        HomeViewSectionArtworks: () => RECOMMENDED_SECTION,
      })

      homeViewStoreActions.setViewableSections(["home-view-section-recommended-artworks"])
      mockTrackEvent.mockClear()

      act(() => {
        homeViewStoreActions.bumpLiveRefetchKey()
      })

      expect(mockTrackEvent).not.toHaveBeenCalledWith(
        expect.objectContaining({ action: "railViewed" })
      )
    })
  })
})
