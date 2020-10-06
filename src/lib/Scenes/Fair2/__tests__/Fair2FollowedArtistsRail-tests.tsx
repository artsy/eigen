import { Fair2FollowedArtistsRailTestsQuery } from "__generated__/Fair2FollowedArtistsRailTestsQuery.graphql"
import { ArtworkTileRailCard } from "lib/Components/ArtworkTileRail"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { Fair2FollowedArtistsRailFragmentContainer } from "../Components/Fair2FollowedArtistsRail"

jest.unmock("react-relay")

describe("Fair2FollowedArtistsRail", () => {
  const trackEvent = useTracking().trackEvent
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<Fair2FollowedArtistsRailTestsQuery>
      environment={env}
      query={graphql`
        query Fair2FollowedArtistsRailTestsQuery($fairID: String!) @raw_response_type @relay_test_operation {
          fair(id: $fairID) {
            ...Fair2FollowedArtistsRail_fair
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

        return <Fair2FollowedArtistsRailFragmentContainer fair={props.fair} />
      }}
    />
  )

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation((operation) => MockPayloadGenerator.generate(operation, mockResolvers))
    })
    return tree
  }

  it("tracks taps on artworks", () => {
    const wrapper = getWrapper({
      Fair: () => ({
        internalID: "xyz123",
        slug: "art-basel-hong-kong-2019",
        followedArtistArtworks: {
          edges: [
            {
              artwork: {
                internalID: "abc123",
                slug: "some-artwork",
              },
            },
          ],
        },
      }),
    })
    const artwork = wrapper.root.findAllByType(ArtworkTileRailCard)[0]
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
})
