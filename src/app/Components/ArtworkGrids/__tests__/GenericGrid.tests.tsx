import { screen } from "@testing-library/react-native"
import { GenericGridTestsQuery } from "__generated__/GenericGridTestsQuery.graphql"
import { GenericGrid } from "app/Components/ArtworkGrids/GenericGrid"
import { extractNodes } from "app/utils/extractNodes"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("GenericGrid", () => {
  const { renderWithRelay } = setupTestWrapper<GenericGridTestsQuery, { isLoading?: boolean }>({
    Component: ({ viewer, isLoading }) => {
      const artworks = extractNodes(viewer?.artworksConnection)
      return <GenericGrid artworks={artworks} isLoading={isLoading} />
    },
    query: graphql`
      query GenericGridTestsQuery @relay_test_operation {
        viewer {
          artworksConnection(first: 3) {
            edges {
              node {
                ...GenericGrid_artworks
              }
            }
          }
        }
      }
    `,
  })

  it("renders without throwing an error", () => {
    renderWithRelay({
      Artwork: () => ({
        id: "artwork-long-title",
        slug: "long-title",
        title: "DO WOMEN STILL HAVE TO BE NAKED TO GET INTO THE MET. MUSEUM",
        date: "2012",
        image: {
          aspectRatio: 2.18,
          blurhash: "test-blurhash",
        },
      }),
    })

    expect(screen.getByLabelText("Artworks Content View")).toBeOnTheScreen()
    expect(
      screen.getByTestId(
        "artworkGridItem-DO WOMEN STILL HAVE TO BE NAKED TO GET INTO THE MET. MUSEUM"
      )
    ).toBeOnTheScreen()
  })

  it("renders spinner when loading", () => {
    renderWithRelay(
      {
        Artwork: () => ({
          id: "artwork-1",
          slug: "test-artwork",
          image: {
            aspectRatio: 1.5,
          },
        }),
      },
      { isLoading: true }
    )

    expect(screen.getByTestId("spinner")).toBeOnTheScreen()
  })
})
