import { FairFollowedArtistsRailTestsQuery } from "__generated__/FairFollowedArtistsRailTestsQuery.graphql"
import { ArtworkRailCard } from "app/Components/ArtworkRail/ArtworkRailCard"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import { TouchableOpacity } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { FairFollowedArtistsRailFragmentContainer } from "./Components/FairFollowedArtistsRail"

jest.unmock("react-relay")

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
    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, mockResolvers)
      )
    })
    return tree
  }

  it("tracks taps on artworks", () => {
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
              },
            },
          ],
        },
      }),
    })
    const artwork = wrapper.root.findAllByType(ArtworkRailCard)[0]
    act(() => artwork.props.onPress())
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

  it("displays the '>' button if there are 3 or more artworks", () => {
    const wrapper = getWrapper({
      Fair: () => ({
        internalID: "xyz123",
        slug: "art-basel-hong-kong-2019",
        filterArtworksConnection: {
          edges: [
            {
              node: {
                internalID: "id-1",
                slug: "some-artwork-1",
              },
            },
            {
              node: {
                internalID: "id-2",
                slug: "some-artwork-2",
              },
            },
            {
              node: {
                internalID: "id-3",
                slug: "some-artwork-3",
              },
            },
            {
              node: {
                internalID: "id-4",
                slug: "some-artwork-4",
              },
            },
          ],
        },
      }),
    })
    expect(wrapper.root.findAllByType(TouchableOpacity).length).toBe(1)
  })

  it("doesn't display the '>' button if there are less than 3 artworks to show", () => {
    const wrapper = getWrapper({
      Fair: () => ({
        internalID: "xyz123",
        slug: "art-basel-hong-kong-2019",
        filterArtworksConnection: {
          edges: [
            {
              node: {
                internalID: "id-1",
                slug: "some-artwork-1",
              },
            },
            {
              node: {
                internalID: "id-2",
                slug: "some-artwork-2",
              },
            },
          ],
        },
      }),
    })
    expect(wrapper.root.findAllByType(TouchableOpacity).length).toBe(0)
  })

  it("tracks taps on the rails header", () => {
    const wrapper = getWrapper({
      Fair: () => ({
        internalID: "xyz123",
        slug: "art-basel-hong-kong-2019",
        filterArtworksConnection: {
          edges: [
            {
              node: {
                internalID: "id-1",
                slug: "some-artwork-1",
              },
            },
            {
              node: {
                internalID: "id-2",
                slug: "some-artwork-2",
              },
            },
            {
              node: {
                internalID: "id-3",
                slug: "some-artwork-3",
              },
            },
            {
              node: {
                internalID: "id-4",
                slug: "some-artwork-4",
              },
            },
          ],
        },
      }),
    })
    const viewAllButton = wrapper.root.findAllByType(TouchableOpacity)[0]
    act(() => viewAllButton.props.onPress())
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
