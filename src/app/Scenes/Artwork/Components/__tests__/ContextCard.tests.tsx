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
    const { getByText } = renderWithRelay({
      Artwork: () => auctionContextArtwork,
    })

    expect(getByText("Christie’s: Prints & Multiples")).toBeTruthy()
  })

  it("renders formatted sale start/end date correctly", () => {
    const { getByText } = renderWithRelay({
      Artwork: () => auctionContextArtwork,
    })

    expect(getByText("Ended Oct 25, 2018")).toBeTruthy()
  })

  it("if auction is live display in progress", () => {
    const saleContextArtwork = {
      ...auctionContextArtwork,
      context: {
        ...auctionContextArtwork.context,
        formattedStartDateTime: "In progress",
      },
    }
    const { getByText } = renderWithRelay({
      Artwork: () => saleContextArtwork,
    })

    expect(getByText("In progress")).toBeTruthy()
  })

  it("renders sale image", () => {
    const { getByLabelText } = renderWithRelay({
      Artwork: () => auctionContextArtwork,
    })

    expect(getByLabelText("Context Card Image")).toBeTruthy()
  })

  it("renders 'Auction' if the sale is an auction", () => {
    const { getByText } = renderWithRelay({
      Artwork: () => auctionContextArtwork,
    })

    expect(getByText("Auction")).toBeTruthy()
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
      url: "https://d32dm0rphc51dk.cloudfront.net/bMu0vqXOVlpABBsWVxVIJA/large_rectangle.jpg",
    },
  },
  shows: [],
  fair: null,
}
