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
      query FairArtworksTestsQuery($fairID: String!) @relay_test_operation {
        fair(id: $fairID) {
          ...FairArtworks_fair @arguments(input: { sort: "-decayed_merch" })
        }
      }
    `,
  })

  it("renders a grid of artworks", async () => {
    renderWithRelay({
      Fair: () => fair,
    })

    expect(screen.queryByText("Artwork Title")).toBeTruthy()
    expect(screen.queryByLabelText("Artworks Grid")).toBeTruthy()
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

    expect(screen.queryByText(/No results found/)).toBeTruthy()
  })
})

const artwork = {
  slug: "artwork-slug",
  id: "artwork-id",
  internalID: "artwork-internalID",
  title: "Artwork Title",
}

const fair = {
  fairArtworks: {
    edges: [{ node: artwork }],
    counts: {
      total: 1,
    },
  },
}
