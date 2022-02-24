import { GeneTestsQuery } from "__generated__/GeneTestsQuery.graphql"
import About from "app/Components/Gene/About"
import { GeneArtworks } from "app/Components/Gene/GeneArtworks"
import { mockEnvironmentPayload } from "app/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { Gene } from "./Gene"

jest.unmock("react-relay")

describe("Gene", () => {
  const geneID = "gene-id"
  let environment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    environment = createMockEnvironment()
  })

  const TestRenderer = () => {
    return (
      <QueryRenderer<GeneTestsQuery>
        environment={environment}
        query={graphql`
          query GeneTestsQuery($geneID: String!, $input: FilterArtworksInput)
          @relay_test_operation {
            gene(id: $geneID) {
              slug
              ...Header_gene
              ...About_gene
              ...GeneArtworks_gene @arguments(input: $input)
            }
          }
        `}
        render={({ props }) => {
          if (props?.gene) {
            return <Gene geneID={geneID} gene={props.gene} />
          }

          return null
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
    mockEnvironmentPayload(environment)
  })

  it("returns all tabs", async () => {
    const tree = renderWithWrappers(<TestRenderer />)
    mockEnvironmentPayload(environment)

    expect(tree.root.findAllByType(GeneArtworks)).toHaveLength(1)
    expect(tree.root.findAllByType(About)).toHaveLength(1)
  })
})
