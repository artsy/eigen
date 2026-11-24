import { screen } from "@testing-library/react-native"
import { ContextCardTestsQuery } from "__generated__/ContextCardTestsQuery.graphql"
import { ContextCardFragmentContainer } from "app/Scenes/Artwork/Components/ContextCard"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ContextCard", () => {
  const { renderWithRelay } = setupTestWrapper<ContextCardTestsQuery>({
    Component: (props) => {
      if (props?.artwork) {
        return <ContextCardFragmentContainer artwork={props.artwork} />
      }

      return null
    },
    query: graphql`
      query ContextCardTestsQuery @relay_test_operation {
        artwork(id: "artworkId") {
          ...ContextCard_artwork
        }
      }
    `,
  })

  it("renders sale name correctly", () => {
    renderWithRelay({
      Artwork: () => auctionContextArtwork,
    })

    expect(screen.getByText("Christie’s: Prints & Multiples")).toBeOnTheScreen()
  })

  it("renders formatted sale start/end date correctly", () => {
    renderWithRelay({
      Artwork: () => auctionContextArtwork,
    })

    expect(screen.getByText("Ended Oct 25, 2018")).toBeOnTheScreen()
  })

  it("if auction is live display in progress", () => {
    const saleContextArtwork = {
      ...auctionContextArtwork,
      context: {
        ...auctionContextArtwork.context,
        formattedStartDateTime: "In progress",
      },
    }
    renderWithRelay({
      Artwork: () => saleContextArtwork,
    })

    expect(screen.getByText("In progress")).toBeOnTheScreen()
  })

  it("renders sale image", () => {
    renderWithRelay({
      Artwork: () => auctionContextArtwork,
    })

    expect(screen.getByLabelText("Context Card Image")).toBeOnTheScreen()
  })

  it("renders 'Auction' if the sale is an auction", () => {
    renderWithRelay({
      Artwork: () => auctionContextArtwork,
    })

    expect(screen.getByText("Auction")).toBeOnTheScreen()
  })

  it("renders nothing if the sale is not an auction", () => {
    const saleContextArtwork = {
      ...auctionContextArtwork,
      context: {
        ...auctionContextArtwork.context,
        isAuction: false,
      },
    }
    const { toJSON } = renderWithRelay({
      Artwork: () => saleContextArtwork,
    })

    expect(toJSON()).toBeNull()
  })
})

const auctionContextArtwork = {
  id: "QXJ0d29yazphbmR5LXdhcmhvbC1tYW8tb25lLXBsYXRlLTM=",
  gravityID: "andy-warhol-mao-one-plate-3",
  internalID: "5bc13101c8d4326cc288ecb8",
  context: {
    __typename: "Sale",
    isLiveOpen: false,
    id: "QXJ0d29ya0NvbnRleHRBdWN0aW9uOmNocmlzdGllcy1wcmludHMtYW5kLW11bHRpcGxlcy02",
    name: "Christie’s: Prints & Multiples",
    href: "/auction/christies-prints-and-multiples-6",
    isAuction: true,
    formattedStartDateTime: "Ended Oct 25, 2018",
    coverImage: {
      url: "https://d32dm0rphc51dk.cloudfront.net/bMu0vqXOVlpABBsWVxVIJA/main.jpg",
    },
  },
  shows: [],
  fair: null,
}
