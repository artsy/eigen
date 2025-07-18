import { FairFollowedArtistsRailTestsQuery } from "__generated__/FairFollowedArtistsRailTestsQuery.graphql"
import { ArtworkRailCard } from "app/Components/ArtworkRail/ArtworkRailCard"
import { FairFollowedArtistsRailFragmentContainer } from "app/Scenes/Fair/Components/FairFollowedArtistsRail"
import { RouterLink } from "app/system/navigation/RouterLink"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

// Mock memo to return the same instance of the component
// issue: https://github.com/facebook/react/issues/17301
jest.mock("react", () => {
  const actualReact = jest.requireActual("react")
  return {
    ...actualReact,
    memo: (component: React.ComponentType<any>) => component,
  }
})

describe("FairFollowedArtistsRail", () => {
  const trackEvent = useTracking().trackEvent
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<FairFollowedArtistsRailTestsQuery>
      environment={env}
      query={graphql`
        query FairFollowedArtistsRailTestsQuery($fairID: String!)
        @raw_response_type
        @relay_test_operation {
          fair(id: $fairID) {
            ...FairFollowedArtistsRail_fair
          }
        }
      `}
      variables={{ fairID: "art-basel-hong-kong-2019" }}
      render={({ props, error }) => {
        if (error) {
          console.log(error)
          return null
        }

        if (!props || !props.fair) {
          return null
        }

        return <FairFollowedArtistsRailFragmentContainer fair={props.fair} />
      }}
    />
  )

  const getWrapper = (mockResolvers = {}) => {
    const { root } = renderWithWrappersLEGACY(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, mockResolvers)
      )
    })
    return { root }
  }

  it("tracks taps on artworks", () => {
    const wrapper = getWrapper({
      Fair: () => ({
        internalID: "xyz123",
        slug: "art-basel-hong-kong-2019",
        filterArtworksConnection: {
          edges: [{ node: { internalID: "abc123", slug: "some-artwork", collectorSignals: null } }],
        },
      }),
    })

    const artwork = wrapper.root.findAllByType(ArtworkRailCard)

    act(() => artwork[0].props.onPress())

    expect(trackEvent).toHaveBeenCalledWith({
      action: "tappedArtworkGroup",
      context_module: "worksByArtistsYouFollowRail",
      context_screen_owner_id: "xyz123",
      context_screen_owner_slug: "art-basel-hong-kong-2019",
      context_screen_owner_type: "fair",
      destination_screen_owner_id: "abc123",
      destination_screen_owner_slug: "some-artwork",
      destination_screen_owner_type: "artwork",
      horizontal_slide_position: 0,
      type: "thumbnail",
    })
  })

  it("tracks taps on artworks with partner offers", () => {
    const wrapper = getWrapper({
      Fair: () => ({
        internalID: "xyz123",
        slug: "art-basel-hong-kong-2019",
        filterArtworksConnection: {
          edges: [
            {
              node: {
                internalID: "abc123",
                slug: "some-artwork",
                collectorSignals: { primaryLabel: "PARTNER_OFFER", auction: null },
              },
            },
          ],
        },
      }),
    })

    const artwork = wrapper.root.findAllByType(ArtworkRailCard)

    act(() => artwork[0].props.onPress())

    expect(trackEvent).toHaveBeenCalledWith({
      action: "tappedArtworkGroup",
      context_module: "worksByArtistsYouFollowRail",
      context_screen_owner_id: "xyz123",
      context_screen_owner_slug: "art-basel-hong-kong-2019",
      context_screen_owner_type: "fair",
      destination_screen_owner_id: "abc123",
      destination_screen_owner_slug: "some-artwork",
      destination_screen_owner_type: "artwork",
      horizontal_slide_position: 0,
      type: "thumbnail",
      signal_label: "Limited-Time Offer",
    })
  })

  it("tracks taps on artworks with auction signals", () => {
    const wrapper = getWrapper({
      Fair: () => ({
        internalID: "xyz123",
        slug: "art-basel-hong-kong-2019",
        filterArtworksConnection: {
          edges: [
            {
              node: {
                internalID: "abc123",
                slug: "some-artwork",
                collectorSignals: {
                  primaryLabel: null,
                  auction: { bidCount: 7, lotWatcherCount: 49 },
                },
              },
            },
          ],
        },
      }),
    })

    const artwork = wrapper.root.findAllByType(ArtworkRailCard)

    act(() => artwork[0].props.onPress())

    expect(trackEvent).toHaveBeenCalledWith({
      action: "tappedArtworkGroup",
      context_module: "worksByArtistsYouFollowRail",
      context_screen_owner_id: "xyz123",
      context_screen_owner_slug: "art-basel-hong-kong-2019",
      context_screen_owner_type: "fair",
      destination_screen_owner_id: "abc123",
      destination_screen_owner_slug: "some-artwork",
      destination_screen_owner_type: "artwork",
      horizontal_slide_position: 0,
      type: "thumbnail",
      signal_label: "",
      signal_bid_count: 7,
      signal_lot_watcher_count: 49,
    })
  })

  it("displays the '>' button if there are 3 or more artworks", async () => {
    const wrapper = getWrapper({
      Fair: () => ({
        internalID: "xyz123",
        slug: "art-basel-hong-kong-2019",
        filterArtworksConnection: {
          edges: [
            { node: { internalID: "id-1", slug: "some-artwork-1" } },
            { node: { internalID: "id-2", slug: "some-artwork-2" } },
            { node: { internalID: "id-3", slug: "some-artwork-3" } },
            { node: { internalID: "id-4", slug: "some-artwork-4" } },
          ],
        },
      }),
    })

    const routerLinkButtons = await wrapper.root.findAllByType(RouterLink)

    // 4 artworks + view all button + browse all button
    expect(routerLinkButtons.length).toBe(6)
  })

  it("doesn't display the '>' button if there are less than 3 artworks to show", async () => {
    const wrapper = getWrapper({
      Fair: () => ({
        internalID: "xyz123",
        slug: "art-basel-hong-kong-2019",
        filterArtworksConnection: {
          edges: [
            { node: { internalID: "id-1", slug: "some-artwork-1" } },
            { node: { internalID: "id-2", slug: "some-artwork-2" } },
          ],
        },
      }),
    })

    const viewAllButton = await wrapper.root.findAllByType(RouterLink)

    expect(viewAllButton.length).toBe(3)
  })

  it("tracks taps on the rails header", () => {
    const wrapper = getWrapper({
      Fair: () => ({
        internalID: "xyz123",
        slug: "art-basel-hong-kong-2019",
        filterArtworksConnection: {
          edges: [
            { node: { internalID: "id-1", slug: "some-artwork-1" } },
            { node: { internalID: "id-2", slug: "some-artwork-2" } },
            { node: { internalID: "id-3", slug: "some-artwork-3" } },
            { node: { internalID: "id-4", slug: "some-artwork-4" } },
          ],
        },
      }),
    })
    const viewAllButton = wrapper.root.findAllByType(RouterLink)
    act(() => viewAllButton[0].props.onPress())
    expect(trackEvent).toHaveBeenCalledWith({
      action: "tappedArtworkGroup",
      context_module: "worksByArtistsYouFollowRail",
      context_screen_owner_id: "xyz123",
      context_screen_owner_slug: "art-basel-hong-kong-2019",
      context_screen_owner_type: "fair",
      destination_screen_owner_type: "fairArtworks",
      type: "viewAll",
    })
  })
})
