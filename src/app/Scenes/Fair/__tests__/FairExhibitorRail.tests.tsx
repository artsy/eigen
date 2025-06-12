import { FairExhibitorRailTestsQuery } from "__generated__/FairExhibitorRailTestsQuery.graphql"
import { ArtworkRailCard } from "app/Components/ArtworkRail/ArtworkRailCard"
import { SectionTitle } from "app/Components/SectionTitle"
import { FairExhibitorRailFragmentContainer } from "app/Scenes/Fair/Components/FairExhibitorRail"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

describe("FairExhibitors", () => {
  const trackEvent = useTracking().trackEvent
  const getWrapper = (mockResolvers = {}) => {
    const env = createMockEnvironment()

    const { root } = renderWithWrappersLEGACY(
      <QueryRenderer<FairExhibitorRailTestsQuery>
        environment={env}
        query={graphql`
          query FairExhibitorRailTestsQuery($showID: String!) @relay_test_operation {
            show(id: $showID) {
              ...FairExhibitorRail_show
            }
          }
        `}
        variables={{ showID: "gagosian-at-art-basel-hong-kong-2020" }}
        render={({ props, error }) => {
          if (error) {
            console.log(error)
            return null
          }

          if (!props || !props.show) {
            return null
          }

          return <FairExhibitorRailFragmentContainer show={props.show} />
        }}
      />
    )

    env.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, mockResolvers)
    )

    return { root }
  }

  it("renders an exhibitor rail", () => {
    const wrapper = getWrapper({
      Show: () => ({
        partner: {
          name: "First Partner Has Artworks",
        },
      }),
    })
    expect(extractText(wrapper.root)).toContain("First Partner Has Artworks")
  })

  it("tracks taps on artworks in the rail", () => {
    const wrapper = getWrapper({
      Show: () => ({
        fair: {
          internalID: "abc123",
          slug: "some-fair",
        },
        artworksConnection: {
          edges: [
            {
              node: {
                internalID: "artwork1234",
                slug: "cool-artwork-1",
                collectorSignals: null,
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
      context_module: "galleryBoothRail",
      context_screen_owner_id: "abc123",
      context_screen_owner_slug: "some-fair",
      context_screen_owner_type: "fair",
      destination_screen_owner_id: "artwork1234",
      destination_screen_owner_slug: "cool-artwork-1",
      destination_screen_owner_type: "artwork",
      horizontal_slide_position: 0,
      type: "thumbnail",
    })
  })

  it("tracks taps on artworks with partner offer in the rail", () => {
    const wrapper = getWrapper({
      Show: () => ({
        fair: {
          internalID: "abc123",
          slug: "some-fair",
        },
        artworksConnection: {
          edges: [
            {
              node: {
                internalID: "artwork1234",
                slug: "cool-artwork-1",
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
      context_module: "galleryBoothRail",
      context_screen_owner_id: "abc123",
      context_screen_owner_slug: "some-fair",
      context_screen_owner_type: "fair",
      destination_screen_owner_id: "artwork1234",
      destination_screen_owner_slug: "cool-artwork-1",
      destination_screen_owner_type: "artwork",
      horizontal_slide_position: 0,
      type: "thumbnail",
      signal_label: "Limited-Time Offer",
    })
  })

  it("tracks taps on artworks with auction signals in the rail", () => {
    const wrapper = getWrapper({
      Show: () => ({
        fair: {
          internalID: "abc123",
          slug: "some-fair",
        },
        artworksConnection: {
          edges: [
            {
              node: {
                internalID: "artwork1234",
                slug: "cool-artwork-1",
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
      context_module: "galleryBoothRail",
      context_screen_owner_id: "abc123",
      context_screen_owner_slug: "some-fair",
      context_screen_owner_type: "fair",
      destination_screen_owner_id: "artwork1234",
      destination_screen_owner_slug: "cool-artwork-1",
      destination_screen_owner_type: "artwork",
      horizontal_slide_position: 0,
      type: "thumbnail",
      signal_label: "",
      signal_bid_count: 7,
      signal_lot_watcher_count: 49,
    })
  })

  it("tracks taps on the show", () => {
    const wrapper = getWrapper({
      Show: () => ({
        internalID: "xxx-2",
        slug: "example-2",
        fair: {
          internalID: "abc123",
          slug: "some-fair",
        },
      }),
    })
    const show = wrapper.root.findAllByType(SectionTitle)
    act(() => show[0].props.onPress())
    expect(trackEvent).toHaveBeenCalledWith({
      action: "tappedArtworkGroup",
      context_module: "galleryBoothRail",
      context_screen_owner_id: "abc123",
      context_screen_owner_slug: "some-fair",
      context_screen_owner_type: "fair",
      destination_screen_owner_id: "xxx-2",
      destination_screen_owner_slug: "example-2",
      destination_screen_owner_type: "show",
      type: "viewAll",
    })
  })
})
