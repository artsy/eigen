import { FairAllFollowedArtistsTestsQuery } from "__generated__/FairAllFollowedArtistsTestsQuery.graphql"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"

import { FairArtworksFragmentContainer } from "./Components/FairArtworks"
import {
  FairAllFollowedArtists,
  FairAllFollowedArtistsFragmentContainer,
} from "./FairAllFollowedArtists"

describe("FairAllFollowedArtists", () => {
  const TestRenderer = () => (
    <QueryRenderer<FairAllFollowedArtistsTestsQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query FairAllFollowedArtistsTestsQuery($fairID: String!) @relay_test_operation {
          fair(id: $fairID) {
            ...FairAllFollowedArtists_fair
          }
          fairForFilters: fair(id: $fairID) {
            ...FairAllFollowedArtists_fairForFilters
          }
        }
      `}
      variables={{ fairID: "art-basel-hong-kong-2019" }}
      render={({ props, error }) => {
        if (props?.fair && props?.fairForFilters) {
          return (
            <FairAllFollowedArtistsFragmentContainer
              fair={props.fair}
              fairForFilters={props.fairForFilters}
            />
          )
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation(mockResolvers)
    return tree
  }

  it("renders without throwing an error", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findAllByType(FairAllFollowedArtists)).toHaveLength(1)
  })

  it("renders a grid of artworks in the fair filtered by artists the user follows", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findAllByType(FairArtworksFragmentContainer)).toHaveLength(1)
    expect(
      wrapper.root.findAllByType(FairArtworksFragmentContainer)[0].props.initiallyAppliedFilter
    ).toStrictEqual([
      {
        displayText: "All Artists I Follow",
        paramName: "includeArtworksByFollowedArtists",
        paramValue: true,
      },
    ])
  })
})
