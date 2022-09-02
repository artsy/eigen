import { FairExhibitorsTestsQuery } from "__generated__/FairExhibitorsTestsQuery.graphql"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { extractText } from "app/tests/extractText"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"

import { FairExhibitorRailFragmentContainer } from "./Components/FairExhibitorRail"
import { FairExhibitorsFragmentContainer } from "./Components/FairExhibitors"

describe("FairExhibitors", () => {
  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappersLEGACY(
      <QueryRenderer<FairExhibitorsTestsQuery>
        environment={getRelayEnvironment()}
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

    resolveMostRecentRelayOperation(mockResolvers)

    return tree
  }

  it("renders the rails from exhibitors that have artworks", () => {
    const wrapper = getWrapper({
      Fair: () => ({
        internalID: "awesome-fair",
        slug: "awesome-fair",
        exhibitors: {
          edges: [
            {
              node: {
                id: "exhibitor-1",
                counts: { artworks: 1 },
                partner: {
                  id: "partner-1",
                },
              },
            },
            {
              node: {
                id: "exhibitor-2",
                counts: { artworks: 5 },
                partner: {
                  id: "partner-3",
                },
              },
            },
            {
              node: {
                id: "exhibitor-3-no-artworks",
                counts: { artworks: 0 },
                partner: {
                  id: "partner-3",
                },
              },
            },
          ],
        },
      }),
    })
    expect(wrapper.root.findAllByType(FairExhibitorRailFragmentContainer)).toHaveLength(2)
  })

  it("skips over any partners with no artworks", () => {
    const wrapper = getWrapper({})
    expect(extractText(wrapper.root)).not.toContain("Partner Without Artworks")
  })
})
