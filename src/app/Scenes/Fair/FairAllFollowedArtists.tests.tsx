import { FairAllFollowedArtistsTestsQuery } from "__generated__/FairAllFollowedArtistsTestsQuery.graphql"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { FairArtworksFragmentContainer } from "./Components/FairArtworks"
import {
  FairAllFollowedArtists,
  FairAllFollowedArtistsFragmentContainer,
} from "./FairAllFollowedArtists"

jest.unmock("react-relay")

describe("FairAllFollowedArtists", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<FairAllFollowedArtistsTestsQuery>
      environment={env}
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
    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, mockResolvers)
      )
    })
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
