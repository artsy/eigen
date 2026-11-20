import { fireEvent, screen } from "@testing-library/react-native"
import { GeneTestsQuery } from "__generated__/GeneTestsQuery.graphql"
import { Gene } from "app/Scenes/Gene/Gene"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"

describe("Gene", () => {
  const geneID = "gene-id"
  const environment = getMockRelayEnvironment()

  const TestRenderer = () => {
    return (
      <QueryRenderer<GeneTestsQuery>
        environment={environment}
        query={graphql`
          query GeneTestsQuery($geneID: String!, $input: FilterArtworksInput)
          @relay_test_operation {
            gene(id: $geneID) {
              displayName
              name
              slug
              ...Header_gene
              ...About_gene
              ...GeneArtworks_gene @arguments(input: $input)
            }
          }
        `}
        render={({ props }) => {
          if (!props?.gene) {
            return null
          }
          return <Gene geneID={geneID} gene={props.gene!} />
        }}
        variables={{
          geneID,
          input: {
            medium: "*",
            priceRange: "*-*",
          },
        }}
      />
    )
  }

  it("renders without throwing an error", () => {
    renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation(environment)
  })

  it("returns all tabs", () => {
    renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation(environment, {
      Gene: () => ({ description: "A gene description" }),
      FilterArtworksConnection: () => ({ counts: { total: 10 } }),
    })

    // GeneArtworks
    expect(screen.getByText("Showing 10 works")).toBeOnTheScreen()
    // About
    expect(screen.getByText("A gene description")).toBeOnTheScreen()
  })

  it("renders filter modal", async () => {
    renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation(environment)

    fireEvent.press(await screen.findByTestId("sort-and-filter-button"))

    // ArtworkFilterOptionsScreen
    expect(screen.getByText("Clear All")).toBeOnTheScreen()
  })
})
