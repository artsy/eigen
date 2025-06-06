import { screen } from "@testing-library/react-native"
import { ContextMenuArtworkPreviewCardTestsQuery } from "__generated__/ContextMenuArtworkPreviewCardTestsQuery.graphql"
import { ContextMenuArtworkPreviewCard } from "app/Components/ContextMenu/ContextMenuArtworkPreviewCard"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ContextMenuArtworkPreviewCard", () => {
  const { renderWithRelay } = setupTestWrapper<ContextMenuArtworkPreviewCardTestsQuery>({
    Component: (props) => <ContextMenuArtworkPreviewCard artwork={props.artwork!} />,
    query: graphql`
      query ContextMenuArtworkPreviewCardTestsQuery @relay_test_operation {
        artwork(id: "artwork-id") {
          ...ContextMenuArtworkPreviewCard_artwork
        }
      }
    `,
  })

  it("renders artwork details correctly", () => {
    renderWithRelay({
      Artwork: () => ({
        artistNames: "John Doe",
        title: "Example Artwork",
        date: "2023",
        partner: { name: "Gallery A" },
        saleMessage: "$5,000",
      }),
    })

    expect(screen.getByText("John Doe")).toBeOnTheScreen()
    expect(screen.getByText("Gallery A")).toBeOnTheScreen()
  })

  it("renders artwork image", () => {
    renderWithRelay({
      Artwork: () => ({
        contextMenuImage: {
          aspectRatio: 1.5,
          resized: {
            src: "https://example.com/artwork.jpg",
            width: 300,
            height: 200,
          },
        },
      }),
    })

    expect(screen.getByTestId("artwork-rail-card-image")).toBeOnTheScreen()
  })
})
