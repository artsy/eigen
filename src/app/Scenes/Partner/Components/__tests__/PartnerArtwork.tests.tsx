import { screen } from "@testing-library/react-native"
import { PartnerArtworkTestsQuery } from "__generated__/PartnerArtworkTestsQuery.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { PartnerArtworkFragmentContainer as PartnerArtwork } from "app/Scenes/Partner/Components/PartnerArtwork"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("PartnerArtwork", () => {
  const { renderWithRelay } = setupTestWrapper<PartnerArtworkTestsQuery>({
    Component: (props) => (
      <ArtworkFiltersStoreProvider>
        <PartnerArtwork partner={props.partner!} />
      </ArtworkFiltersStoreProvider>
    ),
    query: graphql`
      query PartnerArtworkTestsQuery @relay_test_operation {
        partner(id: "anderson-fine-art-gallery-flickinger-collection") {
          ...PartnerArtwork_partner
        }
      }
    `,
  })

  it("renders the artworks", () => {
    renderWithRelay({
      Partner: () => ({
        artworks: {
          edges: [
            {
              node: {
                title: "Artwork Title",
                artistNames: ["Banksy"],
              },
            },
          ],
        },
      }),
    })

    expect(screen.getByText("Artwork Title")).toBeTruthy()
    expect(screen.getByText("Banksy")).toBeTruthy()
  })

  it("renders the empty state", () => {
    renderWithRelay({
      Partner: () => ({
        artworks: {
          edges: [],
        },
      }),
    })

    const emptyText =
      "There are no matching works from this gallery.\nTry changing your search filters"
    expect(screen.getByText(emptyText)).toBeTruthy()
  })
})
