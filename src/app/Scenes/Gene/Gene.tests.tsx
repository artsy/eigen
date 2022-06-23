import { fireEvent, waitFor } from "@testing-library/react-native"
import { GeneTestsQuery } from "__generated__/GeneTestsQuery.graphql"
import { ArtworkFilterOptionsScreen } from "app/Components/ArtworkFilter"
import About from "app/Components/Gene/About"
import { GeneArtworks } from "app/Components/Gene/GeneArtworks"
import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { renderWithWrappers, renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { TouchableHighlightColor } from "palette"
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
          if (!props?.gene) {
            return null
          }
          return (
            <StickyTabPage
              tabs={[
                {
                  title: "test",
                  content: <Gene geneID={geneID} gene={props.gene} />,
                },
              ]}
            />
          )
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

  it("returns all tabs", async () => {
    const tree = renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation(environment)

    expect(tree.root.findAllByType(GeneArtworks)).toHaveLength(1)
    expect(tree.root.findAllByType(About)).toHaveLength(1)
  })

  it("renders filter modal", async () => {
    const { UNSAFE_getByType, UNSAFE_getAllByType } = renderWithWrappersTL(<TestRenderer />)
    resolveMostRecentRelayOperation(environment)

    await waitFor(() => expect(UNSAFE_getByType(TouchableHighlightColor)).toBeTruthy())
    fireEvent.press(UNSAFE_getByType(TouchableHighlightColor))

    expect(UNSAFE_getAllByType(ArtworkFilterOptionsScreen)).toHaveLength(1)
  })
})
