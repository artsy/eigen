import { Fair2ExhibitorsTestsQuery } from "__generated__/Fair2ExhibitorsTestsQuery.graphql"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Button } from "palette"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { Fair2ExhibitorRailFragmentContainer } from "../Components/Fair2ExhibitorRail"
import { Fair2ExhibitorsFragmentContainer } from "../Components/Fair2Exhibitors"

jest.unmock("react-relay")

describe("FairExhibitors", () => {
  const trackEvent = useTracking().trackEvent
  const getWrapper = (mockResolvers = {}) => {
    const env = createMockEnvironment()

    const tree = renderWithWrappers(
      <QueryRenderer<Fair2ExhibitorsTestsQuery>
        environment={env}
        query={graphql`
          query Fair2ExhibitorsTestsQuery($fairID: String!) @relay_test_operation {
            fair(id: $fairID) {
              ...Fair2Exhibitors_fair
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

          return <Fair2ExhibitorsFragmentContainer fair={props.fair} />
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
    expect(wrapper.root.findAllByType(Fair2ExhibitorRailFragmentContainer)).toHaveLength(2)
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
    expect(trackEvent).toHaveBeenCalledWith({
      action: "tappedShowMore",
      context_module: "exhibitorsTab",
      context_screen_owner_type: "fair",
      context_screen_owner_id: "xyz123",
      context_screen_owner_slug: "xxx",
      subject: "Show More",
    })
  })
})
