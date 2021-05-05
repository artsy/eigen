import { FairExhibitorsTestsQuery } from "__generated__/FairExhibitorsTestsQuery.graphql"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { postEventToProviders } from "lib/utils/track/providers"
import { Button } from "palette"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { FairExhibitorRailFragmentContainer } from "../Components/FairExhibitorRail"
import { FairExhibitorsFragmentContainer } from "../Components/FairExhibitors"

jest.unmock("react-relay")

describe("FairExhibitors", () => {
  const getWrapper = (mockResolvers = {}) => {
    const env = createMockEnvironment()

    const tree = renderWithWrappers(
      <QueryRenderer<FairExhibitorsTestsQuery>
        environment={env}
        query={graphql`
          query FairExhibitorsTestsQuery($fairID: String!) @relay_test_operation {
            fair(id: $fairID) {
              ...FairExhibitors_fair
            }
          }
        `}
        variables={{ fairID: "art-basel-hong-kong-2020" }}
        render={({ props, error }) => {
          if (error) {
            console.log(error)
            return null
          }

          if (!props || !props.fair) {
            return null
          }

          return <FairExhibitorsFragmentContainer fair={props.fair} />
        }}
      />
    )

    env.mock.resolveMostRecentOperation((operation) => MockPayloadGenerator.generate(operation, mockResolvers))

    return tree
  }

  it("renders the rails from exhibitors that have artworks", () => {
    const wrapper = getWrapper({
      Fair: () => ({
        exhibitors: {
          edges: [
            {
              node: {
                slug: "exhibitor-1",
              },
            },
            {
              node: {
                slug: "exhibitor-2",
              },
            },
            {
              node: {
                slug: "exhibitor-3-no-artworks",
                counts: { artworks: 0 },
                artworks: null,
              },
            },
          ],
        },
      }),
    })
    expect(wrapper.root.findAllByType(FairExhibitorRailFragmentContainer)).toHaveLength(2)
  })

  it("skips over any partners with no artworks", () => {
    const wrapper = getWrapper()
    expect(extractText(wrapper.root)).not.toContain("Partner Without Artworks")
  })

  it("renders the show more button", () => {
    const wrapper = getWrapper()
    expect(extractText(wrapper.root)).toContain("Show more")
  })

  it("tracks taps on the show more button", () => {
    const wrapper = getWrapper({
      Fair: () => ({
        internalID: "xyz123",
        slug: "xxx",
      }),
    })
    const button = wrapper.root.findAllByType(Button)[0]
    act(() => button.props.onPress())
    expect(postEventToProviders).toHaveBeenCalledWith({
      action: "tappedShowMore",
      context_module: "exhibitorsTab",
      context_screen_owner_type: "fair",
      context_screen_owner_id: "xyz123",
      context_screen_owner_slug: "xxx",
      subject: "Show More",
    })
  })
})
