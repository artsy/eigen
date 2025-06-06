import { FairExhibitorsTestsQuery } from "__generated__/FairExhibitorsTestsQuery.graphql"
import { FairExhibitorRailFragmentContainer } from "app/Scenes/Fair/Components/FairExhibitorRail"
import { FairExhibitorsFragmentContainer } from "app/Scenes/Fair/Components/FairExhibitors"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

describe("FairExhibitors", () => {
  const getWrapper = (mockResolvers = {}) => {
    const env = createMockEnvironment()

    const tree = renderWithWrappersLEGACY(
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

    env.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, mockResolvers)
    )

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
})
