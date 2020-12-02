import { Fair2AllFollowedArtistsTestsQuery } from "__generated__/Fair2AllFollowedArtistsTestsQuery.graphql"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { Fair2ArtworksFragmentContainer } from "../Components/Fair2Artworks"
import { Fair2AllFollowedArtists, Fair2AllFollowedArtistsFragmentContainer } from "../Fair2AllFollowedArtists"

jest.unmock("react-relay")

describe("Fair2AllFollowedArtists", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<Fair2AllFollowedArtistsTestsQuery>
      environment={env}
      query={graphql`
        query Fair2AllFollowedArtistsTestsQuery($fairID: String!) @relay_test_operation {
          fair(id: $fairID) {
            ...Fair2AllFollowedArtists_fair
          }
          fairForFilters: fair(id: $fairID) {
            ...Fair2AllFollowedArtists_fairForFilters
          }
        }
      `}
      variables={{ fairID: "art-basel-hong-kong-2019" }}
      render={({ props, error }) => {
        if (props?.fair && props?.fairForFilters) {
          return <Fair2AllFollowedArtistsFragmentContainer fair={props.fair} fairForFilters={props.fairForFilters} />
        } else if (error) {
          console.log(error)
        }
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

  it("renders without throwing an error", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findAllByType(Fair2AllFollowedArtists)).toHaveLength(1)
  })

  it("renders a grid of artworks in the fair filtered by artists the user follows", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findAllByType(Fair2ArtworksFragmentContainer)).toHaveLength(1)
    expect(wrapper.root.findAllByType(Fair2ArtworksFragmentContainer)[0].props.initiallyAppliedFilter).toStrictEqual([
      {
        displayText: "All artists I follow",
        paramName: "includeArtworksByFollowedArtists",
        paramValue: true,
      },
    ])
  })
})
