import { act, fireEvent, screen } from "@testing-library/react-native"
import { HomeViewSectionArtworksTestsQuery } from "__generated__/HomeViewSectionArtworksTestsQuery.graphql"
import {
  HomeViewStore,
  HomeViewStoreModel,
  HomeViewStoreProvider,
} from "app/Scenes/HomeView/HomeViewContext"
import { HomeViewSectionArtworks } from "app/Scenes/HomeView/Sections/HomeViewSectionArtworks"
import {
  NEW_WORKS_FOR_YOU_SECTION_ID,
  RECOMMENDED_ARTWORKS_SECTION_ID,
  useLiveHomeViewSectionIDs,
} from "app/Scenes/HomeView/hooks/useLiveHomeViewSectionIDs"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Actions } from "easy-peasy"
import { useEffect } from "react"
import { FlatList } from "react-native"
import { graphql } from "react-relay"
import { MockPayloadGenerator } from "relay-test-utils"

jest.mock("app/Scenes/HomeView/hooks/useLiveHomeViewSectionIDs", () => ({
  ...jest.requireActual("app/Scenes/HomeView/hooks/useLiveHomeViewSectionIDs"),
  useLiveHomeViewSectionIDs: jest.fn(),
}))

const mockUseLiveHomeViewSectionIDs = useLiveHomeViewSectionIDs as jest.Mock

const setLiveSectionIDs = (ids: string[]) => {
  mockUseLiveHomeViewSectionIDs.mockReturnValue(ids)
}

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
    setLiveSectionIDs([])
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
      // WTYL live-refresh experiment in the treatment arm (both Unleash flags effectively on).
      setLiveSectionIDs([RECOMMENDED_ARTWORKS_SECTION_ID])
    })

    afterEach(() => {
      setLiveSectionIDs([])
    })

    it("re-fires railViewed only after the live refresh completes", () => {
      const { env } = renderWithRelay({
        HomeViewSectionArtworks: () => RECOMMENDED_SECTION,
      })

      homeViewStoreActions.setViewableSections(["home-view-section-recommended-artworks"])
      mockTrackEvent.mockClear()

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

    it("does not re-fire railViewed on refresh when the WTYL rail is off screen", () => {
      // The refresh-driven railViewed re-fire only happens while the rail is actually on screen.
      const { env } = renderWithRelay({
        HomeViewSectionArtworks: () => RECOMMENDED_SECTION,
      })

      homeViewStoreActions.setViewableSections([])
      mockTrackEvent.mockClear()

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

      // railViewed should not fire because the rail is off screen.
      expect(mockTrackEvent).not.toHaveBeenCalledWith(
        expect.objectContaining({ action: "railViewed" })
      )
    })

    it("re-fires railViewed on every refresh while the rail is in view", () => {
      const { env } = renderWithRelay({
        HomeViewSectionArtworks: () => RECOMMENDED_SECTION,
      })

      homeViewStoreActions.setViewableSections(["home-view-section-recommended-artworks"])
      mockTrackEvent.mockClear()

      const refresh = () => {
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
      }

      // Two separate returns to home, both with the rail in view.
      refresh()
      refresh()

      const railViewedCalls = mockTrackEvent.mock.calls.filter(
        (call) => (call[0] as any)?.action === "railViewed"
      )
      expect(railViewedCalls).toHaveLength(2)
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
      setLiveSectionIDs([])

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

    it("refetches every live rail on a bump even when the rail is off screen", () => {
      const { env } = renderWithRelay({
        HomeViewSectionArtworks: () => RECOMMENDED_SECTION,
      })

      homeViewStoreActions.setViewableSections([])

      const operationsBeforeRefresh = env.mock.getAllOperations().length

      // A refresh (return-to-home or pull-to-refresh) refreshes all live rails.
      act(() => {
        homeViewStoreActions.bumpLiveRefetchKey()
      })

      // A forced refetch is queued regardless of viewport, so the off-screen rail isn't stale.
      expect(env.mock.getAllOperations().length).toBeGreaterThan(operationsBeforeRefresh)
    })

    it("refetches but does not re-fire railViewed when the rail is off screen", () => {
      const { env } = renderWithRelay({
        HomeViewSectionArtworks: () => RECOMMENDED_SECTION,
      })

      homeViewStoreActions.setViewableSections([])
      mockTrackEvent.mockClear()

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

      // The rail refreshed, but tracking stays gated on the rail being in view.
      expect(mockTrackEvent).not.toHaveBeenCalledWith(
        expect.objectContaining({ action: "railViewed" })
      )
    })
  })

  describe("live New Works for You", () => {
    const NWFY_SECTION = {
      internalID: NEW_WORKS_FOR_YOU_SECTION_ID,
      contextModule: "newWorksForYouRail",
      component: { title: "New Works for You" },
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
      // NWFY live-refresh experiment in the treatment arm, independent of WTYL.
      setLiveSectionIDs([NEW_WORKS_FOR_YOU_SECTION_ID])
    })

    afterEach(() => {
      setLiveSectionIDs([])
    })

    it("re-fires railViewed only after the live refresh completes", () => {
      const { env } = renderWithRelay({
        HomeViewSectionArtworks: () => NWFY_SECTION,
      })

      homeViewStoreActions.setViewableSections([NEW_WORKS_FOR_YOU_SECTION_ID])
      mockTrackEvent.mockClear()

      act(() => {
        homeViewStoreActions.bumpLiveRefetchKey()
      })

      // Nothing fires yet — the refreshed data hasn't landed.
      expect(mockTrackEvent).not.toHaveBeenCalledWith(
        expect.objectContaining({ action: "railViewed" })
      )

      act(() => {
        env.mock.resolveMostRecentOperation((operation) =>
          MockPayloadGenerator.generate(operation, {
            HomeViewSectionArtworks: () => NWFY_SECTION,
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
        HomeViewSectionArtworks: () => NWFY_SECTION,
      })

      homeViewStoreActions.setViewableSections([NEW_WORKS_FOR_YOU_SECTION_ID])

      const artworkRail = await UNSAFE_root.findByType(FlatList)
      const onViewableItemsChanged = artworkRail.props.onViewableItemsChanged
      const viewableItems = [{ item: { internalID: "artwork-1-id" }, index: 0 }]

      act(() => {
        onViewableItemsChanged({ viewableItems, changed: [] })
      })

      expect(
        mockTrackEvent.mock.calls.filter((call) => (call[0] as any)?.action === "item_viewed")
      ).toHaveLength(1)

      act(() => {
        homeViewStoreActions.bumpLiveRefetchKey()
      })
      act(() => {
        env.mock.resolveMostRecentOperation((operation) =>
          MockPayloadGenerator.generate(operation, {
            HomeViewSectionArtworks: () => NWFY_SECTION,
          })
        )
      })

      act(() => {
        onViewableItemsChanged({ viewableItems, changed: [] })
      })

      expect(
        mockTrackEvent.mock.calls.filter((call) => (call[0] as any)?.action === "item_viewed")
      ).toHaveLength(2)
    })

    it("does not refresh when only the WTYL experiment is enabled", () => {
      // NWFY's live-refresh is gated by its own experiment — enabling WTYL alone must not make
      // the NWFY rail refetch.
      setLiveSectionIDs([RECOMMENDED_ARTWORKS_SECTION_ID])

      const { env } = renderWithRelay({
        HomeViewSectionArtworks: () => NWFY_SECTION,
      })

      homeViewStoreActions.setViewableSections([NEW_WORKS_FOR_YOU_SECTION_ID])
      mockTrackEvent.mockClear()

      act(() => {
        homeViewStoreActions.bumpLiveRefetchKey()
      })

      // No forced refetch is queued and no railViewed re-fires for the NWFY rail.
      expect(env.mock.getAllOperations()).toHaveLength(0)
      expect(mockTrackEvent).not.toHaveBeenCalledWith(
        expect.objectContaining({ action: "railViewed" })
      )
    })

    it("does not re-fire analytics when the flags are off", () => {
      setLiveSectionIDs([])

      renderWithRelay({
        HomeViewSectionArtworks: () => NWFY_SECTION,
      })

      homeViewStoreActions.setViewableSections([NEW_WORKS_FOR_YOU_SECTION_ID])
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
