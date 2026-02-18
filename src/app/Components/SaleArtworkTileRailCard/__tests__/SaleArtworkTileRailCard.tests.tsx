import { screen } from "@testing-library/react-native"
import { SaleArtworkTileRailCardTestsQuery } from "__generated__/SaleArtworkTileRailCardTestsQuery.graphql"
import {
  CONTAINER_HEIGHT,
  SaleArtworkTileRailCardContainer,
} from "app/Components/SaleArtworkTileRailCard"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("SaleArtworkTileRailCard", () => {
  const { renderWithRelay } = setupTestWrapper<SaleArtworkTileRailCardTestsQuery>({
    Component: (props: any) => <SaleArtworkTileRailCardContainer {...props} />,
    query: graphql`
      query SaleArtworkTileRailCardTestsQuery @relay_test_operation {
        saleArtwork(id: "the-sale") {
          ...SaleArtworkTileRailCard_saleArtwork
        }
      }
    `,
  })

  it("renders sale artwork without throwing an error", () => {
    renderWithRelay({ SaleArtwork: () => mockSaleArtwork })

    // Render the sale artwork fields
    expect(screen.getByText("Banksy")).toBeOnTheScreen()
    expect(screen.getByText("Lot 66002")).toBeOnTheScreen()
    expect(screen.getByText(/Captain America/)).toBeOnTheScreen()

    // Render the sale artwork image while mainting the correct aspect ratio
    const image = screen.getByTestId("sale-artwork-image")
    expect(image.props.style[1].height).toBe(CONTAINER_HEIGHT)
    expect(image.props.style[1].width).toBe(CONTAINER_HEIGHT * 0.75) // The mock image aspect ratio is 0.75
  })

  it("renders custom sale artwork message when useCustomSaleMessage is set to true", () => {
    renderWithRelay({ SaleArtwork: () => mockSaleArtwork }, { useCustomSaleMessage: true })

    expect(screen.getByText(/(14 bids)/)).toBeOnTheScreen()
  })

  it("renders square image when useSquareAspectRatio is set to true", () => {
    renderWithRelay({ SaleArtwork: () => mockSaleArtwork }, { useSquareAspectRatio: true })

    const image = screen.getByTestId("sale-artwork-image")
    expect(image.props.style[1].height).toBe(CONTAINER_HEIGHT)
    expect(image.props.style[1].width).toBe(CONTAINER_HEIGHT)
  })
})

const mockSaleArtwork = {
  artwork: {
    artistNames: "Banksy",
    date: "2018",
    href: "/artwork/href",
    image: {
      imageURL: "imageURL",
      aspectRatio: 0.75,
    },
    internalID: "internalID",
    slug: "artwork slug",
    saleMessage: null,
    title: "Captain America",
  },
  counts: {
    bidderPositions: 14,
  },
  currentBid: {
    display: "$1,100",
  },
  lotLabel: "66002",
  sale: {
    isAuction: true,
    isClosed: false,
    displayTimelyAt: null,
  },
}
