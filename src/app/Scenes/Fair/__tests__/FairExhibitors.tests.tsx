import { act, screen, waitFor } from "@testing-library/react-native"
import { FairExhibitorsTestsQuery } from "__generated__/FairExhibitorsTestsQuery.graphql"
import { FairExhibitorsFragmentContainer } from "app/Scenes/Fair/Components/FairExhibitors"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

describe("FairExhibitors", () => {
  const getWrapper = (mockResolvers = {}) => {
    const env = createMockEnvironment()

    renderWithWrappers(
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

    act(() => {
      env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, mockResolvers)
      )
    })

    return { env }
  }

  it("renders the rails from exhibitors that have artworks", async () => {
    const { env } = getWrapper({
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

    // Each FairExhibitorRailQueryRenderer fires its own query and shows a placeholder while loading
    await waitFor(() => {
      expect(env.mock.getAllOperations()).toHaveLength(2)
    })
    expect(screen.getAllByText("Arwtworks Rail")).toHaveLength(2)
  })

  it("skips over any partners with no artworks", () => {
    getWrapper()
    expect(screen.queryByText(/Partner Without Artworks/)).not.toBeOnTheScreen()
  })
})
