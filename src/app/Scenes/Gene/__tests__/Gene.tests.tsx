import { TouchableHighlightColor } from "@artsy/palette-mobile"
import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { GeneTestsQuery } from "__generated__/GeneTestsQuery.graphql"
import { ArtworkFilterOptionsScreen } from "app/Components/ArtworkFilter"
import About from "app/Components/Gene/About"
import { GeneArtworksContainer } from "app/Components/Gene/GeneArtworks"
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

  it("returns all tabs", async () => {
    renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation(environment)

    expect(screen.UNSAFE_queryAllByType(GeneArtworksContainer)).toHaveLength(1)
    expect(screen.UNSAFE_queryAllByType(About)).toHaveLength(1)
  })

  it("renders filter modal", async () => {
    const { UNSAFE_getByType, UNSAFE_getAllByType } = renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation(environment)

    await waitFor(() => expect(UNSAFE_getByType(TouchableHighlightColor)).toBeTruthy())
    fireEvent.press(UNSAFE_getByType(TouchableHighlightColor))

    expect(UNSAFE_getAllByType(ArtworkFilterOptionsScreen)).toHaveLength(1)
  })
})
