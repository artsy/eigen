import { screen } from "@testing-library/react-native"
import { FairArtworksTestsQuery } from "__generated__/FairArtworksTestsQuery.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { FairArtworks } from "app/Scenes/Fair/Components/FairArtworks"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("FairArtworks", () => {
  const { renderWithRelay } = setupTestWrapper<FairArtworksTestsQuery>({
    Component: ({ fair }) => (
      <ArtworkFiltersStoreProvider>
        <FairArtworks fair={fair} />
      </ArtworkFiltersStoreProvider>
    ),
    query: graphql`
      query FairArtworksTestsQuery @relay_test_operation {
        fair(id: "fair-id") @required(action: NONE) {
          ...FairArtworks_fair
        }
      }
    `,
  })

  it("renders", async () => {
    renderWithRelay({
      Fair: () => ({
        fairArtworks: {
          edges: [{ node: { title: "Artwork Title" } }],
          counts: {
            total: 1,
          },
        },
      }),
    })

    expect(screen.getByText("Artwork Title")).toBeOnTheScreen()
  })

  it("renders empty view if there are no artworks", async () => {
    renderWithRelay({
      Fair: () => ({
        fairArtworks: {
          edges: [],
          counts: {
            total: 0,
          },
        },
      }),
    })

    expect(screen.getByText(/No results found/)).toBeOnTheScreen()
  })
})
