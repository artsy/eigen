import { act, fireEvent, screen } from "@testing-library/react-native"
import { FairFollowedArtistsRailTestsQuery } from "__generated__/FairFollowedArtistsRailTestsQuery.graphql"
import { FairFollowedArtistsRailFragmentContainer } from "app/Scenes/Fair/Components/FairFollowedArtistsRail"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
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
    renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, mockResolvers)
      )
    })
  }

  it("tracks taps on artworks", () => {
    getWrapper({
      Fair: () => ({
        internalID: "xyz123",
        slug: "art-basel-hong-kong-2019",
        filterArtworksConnection: {
          edges: [{ node: { internalID: "abc123", slug: "some-artwork", collectorSignals: null } }],
        },
      }),
    })

    fireEvent.press(screen.getByTestId("artwork-some-artwork"))

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
    getWrapper({
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

    fireEvent.press(screen.getByTestId("artwork-some-artwork"))

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
    getWrapper({
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

    fireEvent.press(screen.getByTestId("artwork-some-artwork"))

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

  it("displays the '>' button if there are 3 or more artworks", () => {
    getWrapper({
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

    // 4 artworks + view all button + browse all button
    expect(screen.getByTestId("artwork-some-artwork-1")).toBeOnTheScreen()
    expect(screen.getByTestId("artwork-some-artwork-2")).toBeOnTheScreen()
    expect(screen.getByTestId("artwork-some-artwork-3")).toBeOnTheScreen()
    expect(screen.getByTestId("artwork-some-artwork-4")).toBeOnTheScreen()
    expect(screen.getByTestId("touchable-wrapper")).toBeOnTheScreen()
    expect(screen.getByText("Browse All Artworks")).toBeOnTheScreen()
  })

  it("doesn't display the '>' button if there are less than 3 artworks to show", () => {
    getWrapper({
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

    // 2 artworks + browse all button, no view all button
    expect(screen.getByTestId("artwork-some-artwork-1")).toBeOnTheScreen()
    expect(screen.getByTestId("artwork-some-artwork-2")).toBeOnTheScreen()
    expect(screen.queryByTestId("touchable-wrapper")).not.toBeOnTheScreen()
    expect(screen.getByText("Browse All Artworks")).toBeOnTheScreen()
  })

  it("tracks taps on the rails header", () => {
    getWrapper({
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
    fireEvent.press(screen.getByTestId("touchable-wrapper"))
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
